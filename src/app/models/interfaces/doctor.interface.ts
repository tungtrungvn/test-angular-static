import { IPagination } from "./common.interface";

export interface IServiceCategory {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface IDoctorService {
  id: number;
  name: string;
}

export interface IPatientReservationRequest extends IPagination   {
  filter?: string;
  categoryId?: number;
  serviceId?: number;
}

export interface IPatientReservationResponse {
  reservationId: number;
  patientId: number;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  gender?: number;
  age?: string;
  serviceName: string;
  status?: string;
  created: Date;
  reviewedByDoctor?: string;
}

export interface ISchedulerWorkingHour {
  startDate: Date;
  endDate: Date;
  recurrenceRule?: string;//         recurrence: "FREQ=DAILY;BYDAY=WE;UNTIL=20211001" //recurrence: "FREQ=WEEKLY;INTERVAL=2;COUNT=2"
  recurrenceException?: string; //recurrenceException: "20210222T070000Z,20210223T070000Z"
}

export interface IDoctorSchedulerData {
  itemConverts: IDoctorSchedulerItemResponse[];
  items: IDoctorSchedulerResponse[];
}

export interface IDoctorSchedulerItemResponse {
  doctorScheduleId: number;
  timeZone: string;
  startUtcAt: string;
  endUtcAt: string;
  repeatInterval: number;
  repeatEndUtcAt?: string;
}

export interface IDoctorSchedulerResponse {
  id: number;
  isAllDay: boolean;
  timeZone: string;
  startUtcAt: string;
  endUtcAt: string;
  repeatDayOfWeeks: number[];
  repeatEndUtcAt?: string;
  repeatType: number;
}

export interface IDoctorSchedulerRequest {
  id?: number;
  startDate: string;
  endDate: string;
  recurrenceRule?: string;
  recurrenceException?: string;
  allDay?: boolean;
}

export interface ChangePassword {
  oldPassword : string,
  newPassword : string
}

export interface EazyscriptAuthToken {
  applicationKey : string,
  applicationSecret : string,
  subDomain : string,
  token : string,
  isVerifiedIDMe : boolean
}

export interface EazyscriptPresecriptionParams {
  eazyscriptPatientId? : number,
  doctorAuthToken: EazyscriptAuthToken
}