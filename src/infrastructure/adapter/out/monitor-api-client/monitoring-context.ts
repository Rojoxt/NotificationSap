import { MonitoringDetailDTO } from "./dto/monitor.dto";

// Clave para adjuntar el contexto al objeto Request
export const MONITORING_CONTEXT_KEY = 'MonitoringContext';

// Clase que lleva los datos a través de la solicitud
export class MonitoringContext {
    // Datos internos que se mapearán al MonitoringDTO
    public details: MonitoringDetailDTO[] = []; 
    public referenceDocument: string = 'N/A';
    public integrator: string = '';
    public codOrganization: string = '';
    public request: string = '';
    public response: string = '';
    public status: string = 'OK';
    public message: string = 'Operación exitosa';
    public requestBody: string = '';
    public responseBody: string = '';
    public webServiceUrl: string = '';
    public endTime: Date = new Date();
    public startTime: Date = new Date();

    // Método para que el Use Case registre una actividad (equivalente a addDetail en Java)
    public addDetail(status: string, source: string, message: string, start: Date) {
        const detail = new MonitoringDetailDTO();
        detail.status = status;
        detail.webServiceUrl = source;
        detail.detail = message;
        // Usar las fechas como Date con zona horaria de Lima
        detail.startDateTime = start;
        detail.endDateTime = new Date();
        this.details.push(detail);
    }

    public setMonitorHead(referenceDocument: string, integrator: string, codOrganization: string) {
        this.referenceDocument = referenceDocument;
        this.integrator = integrator;
        this.codOrganization = codOrganization;
    }

    public setMonitorTail(request: string, response: string) {
        this.request = request;
        this.response = response;
    }
}