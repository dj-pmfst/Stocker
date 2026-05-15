import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../config/prisma.service';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '../../generated/prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Not authenticated');
    }

    const warehouseIdParam = request.params?.warehouseId;
    if (!warehouseIdParam) {
      return true;
    }

    const warehouseId = parseInt(warehouseIdParam, 10);
    if (isNaN(warehouseId)) {
      throw new ForbiddenException('Invalid warehouse id');
    }

    const membership = await this.prisma.userWarehouse.findUnique({
      where: {
        userId_warehouseId: {
          userId: user.id,
          warehouseId: warehouseId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this warehouse');
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(membership.role)) {
        throw new ForbiddenException(
          `Need higher role`,
        );
      }
    }   
    return true;
  }
}
