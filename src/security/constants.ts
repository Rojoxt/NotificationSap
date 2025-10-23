// src/auth/constants.ts

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'mi-clave-secreta',
  // Correspondiente a ${security.jwt.user.generator} de Spring
  issuer: process.env.JWT_PUBLIC || 'mi-clave-publica', 
};