import { IPatientInfo } from "./users.interface";

export interface IAppointmentInfo {
  id: number;
  patient: IPatientInfo;
  time: Date;
  endTime: Date;
  roomName?: string;
  note?: string;
  status?: string;
  canStart?: boolean;
  doctorJoinedAt?: Date;
  patientjoinedAt?: Date;
  appointmentCallId: number
}


export interface IAppointmentTotalInfo {
  totalForToday: number;
}

export interface IAppointmentGetRequest {
  fromDate: string;
  toDate: string;
  skip: number;
  take: number;
  appointmentStatus: string;
  patientName?: string;
  orderDesc: boolean;
}

export interface ChatMessage {
  id : string;
  sessionId : string;
  chatMessage : string;
  userName : string;
  createdAt : Date;
}

export interface EndVisitData
{
  appointmentId: number,
  patientId: number,
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface PendingCallAppointment {
  appointmentId : number,
  roomName : string,
  doctorId : number,
  patientId : number,
  patientName : string,
  patientExtraInfo : string
}

export interface VisitHistory {
  doctorId: number;
  doctorName: string;
  appointmentId: number;
  time: Date;
  endTime: Date;
  status: string;
}

export interface SoapNote {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  appointmentId?: number;
}

export interface OpenTokSessionInfo {
  sessionId: string;
  apiKey: string;
  token: string;
  roomName: string;
}

export interface AppointmentQuestionaire {
  question: string;
  answers: string[];
}
