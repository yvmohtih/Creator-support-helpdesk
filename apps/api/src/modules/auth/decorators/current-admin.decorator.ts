import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedAdmin } from '../types/admin-session-payload';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedAdmin | undefined => {
    const request = context.switchToHttp().getRequest<{ admin?: AuthenticatedAdmin }>();

    return request.admin;
  },
);
