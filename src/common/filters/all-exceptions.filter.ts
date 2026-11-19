import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      const message =
        exception instanceof Error
          ? exception.message
          : JSON.stringify(exception);

      this.logger.error(`Unhandled non-HTTP exception: ${message}`);
      return super.catch(exception, host);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message =
      exception instanceof Error
        ? exception.message
        : JSON.stringify(exception);
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(
      `Unhandled exception: ${request.method} ${request.url} - status ${status} - ${message}`,
      stack,
    );

    if (exception instanceof HttpException) {
      response.status(status).json(exception.getResponse());
      return;
    }
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorResponse,
      cause: exception instanceof Error ? exception.cause : undefined,
      message,
    };
    response.status(status).json(responseBody);
  }
}
