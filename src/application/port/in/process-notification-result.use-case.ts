import { NotificationRequest } from "src/infrastructure/adapter/in/dto/notification-request.dto";
import { NotificationResultResponseDto } from "src/infrastructure/adapter/in/dto/notification-response.dto";

export abstract class ProcessNotificationResultUseCase {
  abstract processResult(request: NotificationRequest): Promise<NotificationResultResponseDto>;
}
