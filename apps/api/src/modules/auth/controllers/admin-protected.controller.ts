import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { AdminRoles } from '../decorators/admin-roles.decorator';
import { CurrentAdmin } from '../decorators/current-admin.decorator';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminSessionGuard } from '../guards/admin-session.guard';
import { AuthenticatedAdmin } from '../types/admin-session-payload';

@Controller('admin/protected')
@UseGuards(AdminSessionGuard, AdminRolesGuard)
@AdminRoles(AdminRole.admin, AdminRole.support_agent)
export class AdminProtectedController {
  @Get('ping')
  ping(@CurrentAdmin() admin: AuthenticatedAdmin) {
    return {
      success: true,
      data: {
        message: 'Admin authorization verified.',
        admin,
      },
    };
  }
}
