// Forzamos la zona horaria del proceso a 'America/Lima'
process.env.TZ = 'America/Lima';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as path from 'path';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { MonitorApiService } from './infrastructure/adapter/out/monitor-api-client/monitor-api-service';
import { MonitoringInterceptor } from './infrastructure/interceptor/monitoring.interceptor';

config({ path: path.resolve(__dirname, '.env') });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true // Esto convierte el JSON plano a una instancia de tu clase DTO.
  }));
  // Primero obtenemos el MonitorApiService del contenedor de dependencias
  const monitorApiService = app.get(MonitorApiService);
  
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new MonitoringInterceptor(monitorApiService)
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
