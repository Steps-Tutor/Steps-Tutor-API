import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of, throwError } from 'rxjs';

import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  const interceptor = new ResponseInterceptor<unknown>();

  const contextWith = (statusCode: number) =>
    ({
      switchToHttp: () => ({ getResponse: () => ({ statusCode }) }),
    }) as unknown as ExecutionContext;

  const handlerReturning = (value: unknown): CallHandler => ({
    handle: () => of(value),
  });

  it('wraps the payload in { data, status, success }', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(contextWith(200), handlerReturning({ a: 1 })),
    );

    expect(result).toEqual({ data: { a: 1 }, status: 200, success: true });
  });

  it.each([200, 201, 204, 299])('marks status %i as success', async (code) => {
    const result = await lastValueFrom(
      interceptor.intercept(contextWith(code), handlerReturning('x')),
    );
    expect(result.success).toBe(true);
    expect(result.status).toBe(code);
  });

  it.each([199, 300, 400, 404, 500])('marks status %i as not successful', async (code) => {
    const result = await lastValueFrom(
      interceptor.intercept(contextWith(code), handlerReturning('x')),
    );
    expect(result.success).toBe(false);
  });

  it('wraps null and undefined payloads', async () => {
    const nullResult = await lastValueFrom(
      interceptor.intercept(contextWith(200), handlerReturning(null)),
    );
    const undefinedResult = await lastValueFrom(
      interceptor.intercept(contextWith(200), handlerReturning(undefined)),
    );

    expect(nullResult.data).toBeNull();
    expect(undefinedResult.data).toBeUndefined();
  });

  it('does not swallow errors from the handler', async () => {
    const handler: CallHandler = {
      handle: () => throwError(() => new Error('handler failed')),
    };

    await expect(
      lastValueFrom(interceptor.intercept(contextWith(200), handler)),
    ).rejects.toThrow('handler failed');
  });
});
