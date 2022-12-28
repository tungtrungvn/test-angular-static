export enum EAppointmentStatus {
  UpComing = 'UpComing',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  DroppedCall = 'DroppedCall',
}

export enum EAppointmentNotificationType {
  NewAppointment = 30,
  CommingAppointment = 40,
  RescheduleAppointment = 50,
  CancelAppointment = 60
}
