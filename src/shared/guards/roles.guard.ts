// src/common/guards/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// Nota: El 'user' es el objeto devuelto por JwtStrategy.validate()

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles required, access granted
    }

    const { user } = context.switchToHttp().getRequest();

    // Lógica de autorización: el rol del usuario debe coincidir con alguno de los requeridos
    return requiredRoles.includes(user.role); // 'user.role' viene del payload del JWT
  }
}