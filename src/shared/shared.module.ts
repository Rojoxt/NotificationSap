import { Module, Global, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosInstance } from 'axios';
import { convertDates } from './config/date.config';

// Provider que entrega una instancia de HttpService construida sobre un axios
// que ya tiene registrado el interceptor para convertir fechas.
const httpServiceProvider = {
  provide: HttpService,
  useFactory: (): HttpService => {
    const logger = new Logger('GlobalHttpService');
    const axiosInstance: AxiosInstance = axios.create({ timeout: 5000 });

    axiosInstance.interceptors.request.use((config: any) => {
      try {
        if (config?.data) {
         
          // Si el payload es string, intentar parsearlo a objeto
          if (typeof config.data === 'string') {
            try {
              config.data = JSON.parse(config.data);
            } catch (e) {
              // no JSON -> dejar como está
            }
          }

          // Convertir fechas en el payload
          config.data = convertDates(config.data);

          // Asegurar que el cuerpo sigue siendo string para axios
          try {
            config.data = JSON.stringify(config.data);
          } catch (e) {
            // si no stringify, dejarlo
          }
        }
      } catch (error) {
        logger.error(`Error in global date formatter interceptor: ${String(error?.message || error)}`);
      }
      return config;
    });

    // Construir y devolver un HttpService que usa esta instancia de axios
    return new HttpService(axiosInstance);
  }
};

@Global()
@Module({
  providers: [httpServiceProvider],
  exports: [HttpService],
})
export class SharedModule {}