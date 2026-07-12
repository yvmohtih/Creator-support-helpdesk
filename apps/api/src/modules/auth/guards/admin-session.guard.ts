import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthService } from '../services/admin-auth.service';
import { AuthenticatedAdmin } from '../types/admin-session-payload';

type AdminRequest = Request & {
  admin?: AuthenticatedAdmin;
  cookies?: Record<string, string>;
};

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(@Inject(AdminAuthService) private readonly adminAuth: AdminAuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AdminRequest>();
    const token = request.cookies?.[this.adminAuth.cookieName];

    request.admin = await this.adminAuth.validateToken(token);

    return true;
  }
}
