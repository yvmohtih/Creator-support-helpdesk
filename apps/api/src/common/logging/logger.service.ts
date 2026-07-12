import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import pino, { Logger } from 'pino';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    redact: ['req.headers.authorization', 'password', 'passwordHash'],
  });

  log(message: unknown, context?: string) {
    this.logger.info({ context, message: this.toLogValue(message) });
  }

  error(message: unknown, trace?: string, context?: string) {
    this.logger.error({ context, trace, message: this.toLogValue(message) });
  }

  warn(message: unknown, context?: string) {
    this.logger.warn({ context, message: this.toLogValue(message) });
  }

  debug(message: unknown, context?: string) {
    this.logger.debug({ context, message: this.toLogValue(message) });
  }

  verbose(message: unknown, context?: string) {
    this.logger.trace({ context, message: this.toLogValue(message) });
  }

  private toLogValue(message: unknown) {
    return message instanceof Error ? { name: message.name, message: message.message } : message;
  }
}
