// src/security/jwt.service.usecase.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify, decode, JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtServiceUseCase {
  private readonly privateKey  = process.env.JWT_SECRET || 'mi-clave-secreta';
  private readonly userGenerator  = process.env.USER_GENERATOR || 'mi-clave-publica';

  isTokenValid(token: string): JwtPayload {
    try {
         const decoded = verify(token, this.privateKey, {
        algorithms: ['HS256'],
        issuer: this.userGenerator,
      }) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  extractUsername(decoded: JwtPayload): string | undefined {
    return decoded.sub;
  }

  decodeToken(token: string): JwtPayload | null {
    return decode(token) as JwtPayload | null;
  }

   getSpecificClaim(decoded: JwtPayload, claimName: string): any {
    return decoded?.[claimName];
  }
}
