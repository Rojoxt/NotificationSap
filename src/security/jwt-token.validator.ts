// src/security/jwt-token.validator.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtServiceUseCase } from './jwt.service.usecase';

@Injectable()
export class JwtTokenValidator implements NestMiddleware {
  constructor(private readonly jwtService: JwtServiceUseCase) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException('Token no proporcionado');

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.isTokenValid(token);
    req['user'] = {
      username: this.jwtService.extractUsername(decoded),
      roles: this.jwtService.getSpecificClaim(decoded, 'authorities'),
      claims: decoded,
    };
    next();
  }
}
