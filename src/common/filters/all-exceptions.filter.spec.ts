import { ArgumentsHost, BadRequestException, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let json: jest.Mock;
  let status: jest.Mock;
  let response: { status: jest.Mock };
  const request = { method: 'POST', url: '/ai/cowrite-problem' };

  const httpHost = (): ArgumentsHost =>
    ({
      getType: () => 'http',
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    }) as unknown as ArgumentsHost;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    response = { status };
    filter = new AllExceptionsFilter();
  });

  afterEach(() => jest.restoreAllMocks());

  describe('HTTP context', () => {
    it('returns an HttpException response body with its own status', () => {
      filter.catch(new NotFoundException('missing'), httpHost());

      expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(json).toHaveBeenCalledWith({
        message: 'missing',
        error: 'Not Found',
        statusCode: 404,
      });
    });

    it('preserves validation error arrays from BadRequestException', () => {
      const exception = new BadRequestException(['title must be a string']);

      filter.catch(exception, httpHost());

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith(exception.getResponse());
    });

    it('supports custom HttpException statuses and string bodies', () => {
      filter.catch(new HttpException('teapot', 418), httpHost());

      expect(status).toHaveBeenCalledWith(418);
      expect(json).toHaveBeenCalledWith('teapot');
    });

    it('maps a generic Error to a 500 response with details', () => {
      const error = new Error('kaboom');

      filter.catch(error, httpHost());

      expect(status).toHaveBeenCalledWith(500);
      const body = json.mock.calls[0][0];
      expect(body).toMatchObject({
        statusCode: 500,
        path: '/ai/cowrite-problem',
        error: 'Internal server error',
        message: 'kaboom',
      });
      expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');
    });

    it('includes the error cause when present', () => {
      const cause = new Error('root cause');
      const error = new Error('outer', { cause });

      filter.catch(error, httpHost());

      expect(json.mock.calls[0][0].cause).toBe(cause);
    });

    it('stringifies non-Error exceptions', () => {
      filter.catch({ code: 'X' }, httpHost());

      expect(status).toHaveBeenCalledWith(500);
      expect(json.mock.calls[0][0].message).toBe('{"code":"X"}');
    });

    it('logs method, url, status and message', () => {
      filter.catch(new Error('kaboom'), httpHost());

      const logged = (Logger.prototype.error as jest.Mock).mock.calls[0][0];
      expect(logged).toContain('POST /ai/cowrite-problem');
      expect(logged).toContain('status 500');
      expect(logged).toContain('kaboom');
    });
  });

  describe('non-HTTP context', () => {
    it('logs and delegates to BaseExceptionFilter', () => {
      const superCatch = jest
        .spyOn(BaseExceptionFilter.prototype, 'catch')
        .mockImplementation(() => undefined);
      const host = { getType: () => 'rpc' } as unknown as ArgumentsHost;
      const error = new Error('rpc failure');

      filter.catch(error, host);

      expect(superCatch).toHaveBeenCalledWith(error, host);
      expect((Logger.prototype.error as jest.Mock).mock.calls[0][0]).toContain(
        'rpc failure',
      );
      expect(status).not.toHaveBeenCalled();
    });

    it('stringifies non-Error exceptions when logging', () => {
      jest
        .spyOn(BaseExceptionFilter.prototype, 'catch')
        .mockImplementation(() => undefined);
      const host = { getType: () => 'ws' } as unknown as ArgumentsHost;

      filter.catch('plain string', host);

      expect((Logger.prototype.error as jest.Mock).mock.calls[0][0]).toContain(
        '"plain string"',
      );
    });
  });
});
