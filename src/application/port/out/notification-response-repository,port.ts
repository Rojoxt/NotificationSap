export abstract class UpdateNotificationStatusPort {
  abstract updateNotification(numOp: string, guiYob: string, status: string, message: string, peCodigo: string, pdate: string): Promise<void>;
}
