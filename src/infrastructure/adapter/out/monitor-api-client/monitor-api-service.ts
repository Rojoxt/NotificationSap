// src/infrastructure/adapter/out/external-api-client/monitor-api.service.ts

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { MonitoringDTO } from './dto/monitor.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class MonitorApiService {
  private readonly logger = new Logger(MonitorApiService.name);
  private readonly monitorUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, 
  ) {
    this.monitorUrl = this.configService.getOrThrow<string>('MONITOR_URL'); 
  }

  // Date formatting is handled globally by the SharedModule interceptor.

  async sendMonitoringData(request: MonitoringDTO): Promise<any> {
    const url = this.monitorUrl;

    try {
      this.logger.log('🔄 Preparando envío a Monitor API...');
      
      // Convertir el request a un objeto plano
      const plainRequest = instanceToPlain(request) as any;
      

      const { data: responseData } = await firstValueFrom(
        this.httpService.post(url, plainRequest, {
          headers: {
            'Content-Type': 'application/json',
          }
        }),
      );
      
      this.logger.log('✅ Notificación enviada exitosamente');
      return responseData;

    } catch (error) {
      this.logger.error('Fallo la notificación a la API Pública.', error.message);
      
      // Manejo de error estandarizado de NestJS
      throw new InternalServerErrorException('Error al comunicar con el servicio de monitoreo externo.'); 
    }
  }
}