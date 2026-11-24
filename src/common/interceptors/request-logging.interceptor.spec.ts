import { CallHandler, ExecutionContext, Logger } from '@nestjs/common';
import { lastValueFrom, of, throwError } from 'rxjs';

import { RequestLoggingInterceptor } from './request-logging.interceptor';

describe('RequestLoggingInterceptor', () => {
  let interceptor: RequestLoggingInterceptor;
  let logSpy: jest.SpyInstance;

  const contextWith = (request: object, response: object = { statusCode: 200 }) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    }) as unknown as ExecutionContext;

  const handler = (value: unknown = 'ok'): CallHandler => ({
    handle: () => of(value),
  });

  beforeEach(() => {
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    interceptor = new RequestLoggingInterceptor();
  });

  afterEach(() => jest.restoreAllMocks());

  it('passes the handler result through unchanged', async () => {
    const request = { method: 'GET', originalUrl: '/x', headers: {}, ip: '1.1.1.1' };

    const result = await lastValueFrom(
      interceptor.intercept(contextWith(request), handler({ a: 1 })),
    );

    expect(result).toEqual({ a: 1 });
  });

  it('logs the incoming request with agent and ip', async () => {
    const request = {
      method: 'POST',
      originalUrl: '/ai/planning-response',
      headers: { 'user-agent': 'jest-agent' },
      ip: '10.0.0.1',
    };

    await lastValueFrom(interceptor.intercept(contextWith(request), handler()));

    expect(logSpy.mock.calls[0][0]).toBe(
      'POST /ai/planning-response | agent: jest-agent | ip: 10.0.0.1',
    );
  });

  it('logs status and elapsed time after the handler completes', async () => {
    const request = { method: 'GET', originalUrl: '/x', headers: {}, ip: '1.1.1.1' };

    await lastValueFrom(
      interceptor.intercept(contextWith(request, { statusCode: 201 }), handler()),
    );

    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy.mock.calls[1][0]).toMatch(/^GET \/x \| status: 201 \| \d+ms$/);
  });

  it('falls back to "unknown" when user-agent is missing', async () => {
    const request = { method: 'GET', originalUrl: '/x', headers: {}, ip: '1.1.1.1' };

    await lastValueFrom(interceptor.intercept(contextWith(request), handler()));

    expect(logSpy.mock.calls[0][0]).toContain('agent: unknown');
  });

  it('falls back to the socket address when request.ip is missing', async () => {
    const request = {
      method: 'GET',
      originalUrl: '/x',
      headers: {},
      socket: { remoteAddress: '192.168.0.5' },
    };

    await lastValueFrom(interceptor.intercept(contextWith(request), handler()));

    expect(logSpy.mock.calls[0][0]).toContain('ip: 192.168.0.5');
  });

  it('falls back to "unknown" when no ip information exists', async () => {
    const request = { method: 'GET', originalUrl: '/x', headers: {}, socket: {} };

    await lastValueFrom(interceptor.intercept(contextWith(request), handler()));

    expect(logSpy.mock.calls[0][0]).toContain('ip: unknown');
  });

  it('does not log completion when the handler errors', async () => {
    const request = { method: 'GET', originalUrl: '/x', headers: {}, ip: '1.1.1.1' };
    const failing: CallHandler = {
      handle: () => throwError(() => new Error('fail')),
    };

    await expect(
      lastValueFrom(interceptor.intercept(contextWith(request), failing)),
    ).rejects.toThrow('fail');
    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
