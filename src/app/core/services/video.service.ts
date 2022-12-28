import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoApiService } from './api/video-api.service';
import { AppointmentQuestionaire, IAppointmentGetRequest, IAppointmentInfo, IAppointmentTotalInfo, PendingCallAppointment, SoapNote, VisitHistory } from '@app/models/interfaces/videocall.interface';
import { IScrollResponse } from '@app/models/interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(
    private videoApiService: VideoApiService,
  ) { }

  getTotalAppointmentToday(): Observable<IAppointmentTotalInfo> {
    return this.videoApiService.getTotalAppointmentToday();
  }

  getAppointments(params: IAppointmentGetRequest): Observable<IScrollResponse<IAppointmentInfo>> {
    return this.videoApiService.getAppointments(params);
  }

  getAppointment(appointmentId : number): Observable<IAppointmentInfo> {
    return this.videoApiService.getAppointment(appointmentId);
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.videoApiService.cancelAppointment(appointmentId);
  }

  getPendingCallAppointment (): Observable<PendingCallAppointment> {
    return this.videoApiService.getPendingCallAppointment();
  }

  getVisitHistories(patientId : number): Observable<VisitHistory[]> {
    return this.videoApiService.getVisitHistories(patientId);
  }

  getAppointmentSoapNote(appointmentId : number): Observable<SoapNote> {
    return this.videoApiService.getAppointmentSoapNote(appointmentId);
  }

  upsertAppointmentSoapNote(request : SoapNote): Observable<SoapNote> {
    return this.videoApiService.upsertAppointmentSoapNote(request);
  }

  getAppointmentQuestionaire(appointmentId : number): Observable<AppointmentQuestionaire[]> {
    return this.videoApiService.getAppointmentQuestionaire(appointmentId);
  }
}
