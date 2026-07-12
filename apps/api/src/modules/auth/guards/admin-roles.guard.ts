import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@prisma/client';
import { ADMIN_ROLES_KEY } from '../constants/admin-auth.constants';
import { AuthenticatedAdmin } from '../types/admin-session-payload';
import { AdminAuthService } from '../services/admin-auth.service';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(AdminAuthService) private readonly adminAuth: AdminAuthService,
  ) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<AdminRole[]>(ADMIN_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ admin?: AuthenticatedAdmin }>();

    if (!request.admin || !this.adminAuth.hasAnyRole(request.admin, roles)) {
      throw new ForbiddenException('You do not have permission to access this resource.');
    }

    return true;
  }
}
