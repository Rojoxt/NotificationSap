# SAP Notification Processing Microservice

## Description

Este microservicio está construido con NestJS y proporciona una API RESTful para procesar notificaciones de SAP. El servicio está diseñado siguiendo los principios de la Arquitectura Hexagonal (Ports and Adapters) y maneja específicamente las notificaciones SAP con autenticación JWT y control de roles.

## Características Principales

- Procesamiento de notificaciones SAP
- Autenticación JWT
## Tecnologías

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: DB2
- **Autenticación**: JWT
- **Validación**: class-validator y class-transformer
- **Timezone**: Luxon para manejo de zonas horarias
- **Testing**: Jest

## Estructura del Proyecto

```
src/
├── application/          # Casos de uso de la aplicación
├── domain/              # Entidades y lógica de dominio
├── infrastructure/      # Adaptadores y configuración
│   ├── adapter/         # Adaptadores de entrada/salida
│   ├── database/        # Configuración de DB2
│   └── interceptor/     # Interceptores globales
├── security/            # Configuración de seguridad JWT
└── shared/             # Componentes compartidos
```

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Base de datos DB2
- Variables de entorno configuradas

## Instalación

```bash
$ npm install
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
AS400_ODBC_DRIVER_NAME="{iSeries Access ODBC Driver}"
AS400_SYSTEM_IP=# Dirección IP o nombre de host del AS/400

# Credenciales
AS400_USERNAME=usuario
AS400_PASSWORD=contraseña

# Configuración adicional del DB2
# Naming=1 (System Naming, *SYS) o Naming=0 (SQL Naming, *SQL)
AS400_NAMING_CONVENTION=1
AS400_DEFAULT_LIBRARIES=añadir librerias que necesite db2,

MONITOR_URL=url del mointoreo de la api

JWT_SECRET=jwt secret
USER_GENERATOR=*
```

## Scripts Disponibles

```bash
# desarrollo
$ npm run start:dev

# producción
$ npm run start:prod

# tests
$ npm run test

# tests e2e
$ npm run test:e2e

# coverage
$ npm run test:cov
```

## API Endpoints

### POST /api/v1/resultado-sap-notificacion-pt
- **Descripción**: Procesa notificaciones de SAP
- **Autenticación**: Requiere JWT
- **Rol Requerido**: ROLE_ADMINISTRATOR
- **Body**: NotificationRequest DTO

## Seguridad

El microservicio implementa:
- Autenticación mediante JWT
- Control de acceso basado en roles (RBAC)
- Guardias de seguridad personalizados
- Interceptores para monitoreo y logging

## Características Técnicas

1. **Arquitectura Hexagonal**
   - Separación clara de responsabilidades
   - Adaptadores de entrada/salida bien definidos
   - Casos de uso aislados

2. **Manejo de Fechas**
   - Zona horaria configurada para América/Lima
   - Interceptores globales para transformación de fechas
   - Uso de Luxon para manipulación de fechas

3. **Validación**
   - DTOs con decoradores de validación
   - Transformación automática de datos
   - Validación de tipos y formatos

4. **Monitoreo**
   - Interceptor global para monitoreo
   - Logging de requests y responses
   - Tracking de tiempos de respuesta

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

[UNLICENSED]

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
