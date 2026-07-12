import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { Request, Response } from 'express';
import { AdminRoles } from '../decorators/admin-roles.decorator';
import { CurrentAdmin } from '../decorators/current-admin.decorator';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminSessionGuard } from '../guards/admin-session.guard';
import { AdminAuthService } from '../services/admin-auth.service';
import { AuthenticatedAdmin } from '../types/admin-session-payload';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(@Inject(AdminAuthService) private readonly adminAuth: AdminAuthService) {}

  @Post('login')
  async login(
    @Body() body: AdminLoginDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const admin = await this.adminAuth.login(body.email, body.password, response, request.ip);

    return {
      success: true,
      data: { admin },
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    this.adminAuth.logout(response);

    return {
      success: true,
    };
  }

  @Get('me')
  @UseGuards(AdminSessionGuard, AdminRolesGuard)
  @AdminRoles(AdminRole.admin, AdminRole.support_agent)
  me(@CurrentAdmin() admin: AuthenticatedAdmin) {
    return {
      success: true,
      data: { admin },
    };
  }
}
