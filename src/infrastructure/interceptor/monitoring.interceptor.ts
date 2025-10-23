import { CallHandler, ExecutionContext, Injectable, NestInterceptor, InternalServerErrorException, Logger } from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { MonitorApiService } from '../adapter/out/monitor-api-client/monitor-api-service';
import { NotificationRequest } from '../adapter/in/dto/notification-request.dto';
import { MONITORING_CONTEXT_KEY, MonitoringContext } from '../adapter/out/monitor-api-client/monitoring-context';
import { MonitoringDTO } from '../adapter/out/monitor-api-client/dto/monitor.dto';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MonitoringInterceptor.name);

    constructor(private readonly monitorApiService: MonitorApiService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const notificationRequest: NotificationRequest = request.body; // El cuerpo ya parseado
        
        let status = "ERROR";
        let message = "Ha ocurrido un error inesperado";

        // 1. 🟢 CREAR y ADJUNTAR el Contexto
        const monitoringContext = new MonitoringContext();
        request[MONITORING_CONTEXT_KEY] = monitoringContext; 
        
        // 2. Captura inicial de datos
        monitoringContext.requestBody = JSON.stringify(notificationRequest); // Captura el body parseado
        monitoringContext.webServiceUrl = request.originalUrl; // Captura la URL del servicio
        
        // 3. Pasar al controller (chain.doFilter)
        return next.handle().pipe(
            // 4. Monitoreo en caso de ÉXITO
            tap((responseBody) => {
                // El servicio ya actualizó el estado y mensaje en el contexto
                status = monitoringContext.status || "OK";
                message = monitoringContext.message || "Proceso finalizado correctamente";
                
                // 🔹 Captura el cuerpo de la RESPUESTA
                monitoringContext.responseBody = JSON.stringify(responseBody);
                
                // Solo enviamos una vez al final
                this.finalizeAndSend(monitoringContext, status, message, responseBody);
            }),
            // 5. Monitoreo en caso de ERROR
            catchError(err => {
                status = "ERROR";
                message = `Error en el procesamiento de la solicitud: ${err.message}`;
                
                // 🔹 Captura el error en la respuesta
                monitoringContext.responseBody = JSON.stringify({
                    statusCode: err.status || 500,
                    message: err.message,
                    error: err.name,
                });
                
                this.finalizeAndSend(monitoringContext, status, message);
                
                // Relanza el error para que el NestJS ExceptionsHandler lo maneje
                return throwError(() => err);
            }),
        );
    }

    private finalizeAndSend(
        context: MonitoringContext, 
        status: string, 
        message: string, 
        response?: any,
        ) {
        
        context.endTime = new Date();
        context.status = status;
        context.message = message;

        const countryCode= context.codOrganization?.substring(0,2).toUpperCase() || 'MX';
        
        // 6. Mapeo final y Envío
        const monitoringPayload: MonitoringDTO = {
            // ... Mapeo de campos ...
            jsonData: context.requestBody, 
            referenceDocument: context.referenceDocument || 'N/A',
            status: context.status,
            message: context.message,
            startDateTime: context.startTime,
            endDateTime: context.endTime,
            webServiceUrl: context.webServiceUrl,
            country: countryCode,
            integrator: context.integrator,
            organizationCode: context.codOrganization,
            jsonResponse: context.responseBody,
            monitoringDetail: context.details,
        };

        this.monitorApiService.sendMonitoringData(monitoringPayload).catch(e => {
            this.logger.error('CRITICAL: Failed to send monitoring data.', e.message);
        });
    }
}