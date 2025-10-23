import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtServiceUseCase } from '../jwt.service.usecase';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtServiceUseCase) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.isTokenValid(token);

    // Mapear a la estructura que espera el RolesGuard
    req['user'] = {
      username: this.jwtService.extractUsername(decoded),
      role: decoded?.role || decoded?.roles || decoded?.authority || decoded?.authorities,
      claims: decoded,
    };

    return true;
  }
}
