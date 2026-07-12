import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logging/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttpException ? this.getHttpErrorMessage(exception) : 'Something went wrong.';

    const logPayload = {
      path: request.url,
      method: request.method,
      status,
      err: this.toLogError(exception),
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(logPayload, 'Request failed');
    } else {
      this.logger.warn(logPayload, 'Request rejected');
    }

    response.status(status).json({
      success: false,
      error: {
        code: isHttpException ? 'HTTP_ERROR' : 'SERVER_ERROR',
        message,
      },
    });
  }

  private toLogError(exception: unknown) {
    if (exception instanceof Error) {
      return {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      };
    }

    return exception;
  }

  private getHttpErrorMessage(exception: HttpException) {
    const response = exception.getResponse();

    if (typeof response === 'object' && response !== null && 'message' in response) {
      const message = (response as { message?: unknown }).message;

      if (Array.isArray(message)) {
        return message.join(' ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return exception.message;
  }
}
