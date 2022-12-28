import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from '@core/services/util.service';
import { AppointmentQuestionaire, IAppointmentGetRequest, IAppointmentInfo, IAppointmentTotalInfo, OpenTokSessionInfo, SoapNote, VisitHistory } from '@app/models/interfaces/videocall.interface';
import { IScrollResponse } from '@app/models/interfaces/common.interface';

const routes = {
  getTotalAppointmentTodayUrl: '/videoCall/total-appointment-today',
  getAppointmentsUrl: '/videoCall/appointments',
  getAppointmentUrl: (appointmentId: number) => `/videoCall/appointments/${appointmentId}`,
  cancelAppointmentUrl: (appointmentId: number) => `/videoCall/appointment-cancel/${appointmentId}`,
  getPendingCallAppointmentUrl: '/videoCall/check-pending-call',
  getVisitHistoriesUrl: (patientId: number) => `/videoCall/patient-visit-history/${patientId}`,
  getAppointmentSoapNoteUrl: (appointmentId: number) => `/videoCall/appointment-soapnote/${appointmentId}`,
  upsertAppointmentSoapNoteUrl: '/videoCall/appointment-soapnote',
  dropCallUrl: (appointmentId: number) => `/videocall/appointment-dropcall/${appointmentId}`,
  getOpenTokSessionUrl: '/videocall/session',
  getQuestionaireInfo: (appointmentId: number) => `/videocall/appointment-questionaires?appointmentId=${appointmentId}`,
};


@Injectable({
  providedIn: 'root'
})
export class VideoApiService {

  constructor(
    private _apiService: ApiService,
    private _utilService: UtilService
  ) { }

  getAppointmentQuestionaire(appointmentId : number): Observable<AppointmentQuestionaire[]> {
    return this._apiService.get(routes.getQuestionaireInfo(appointmentId));
  }


  dropCall(appointmentId : number): Observable<any> {
    return this._apiService.put(routes.dropCallUrl(appointmentId));
  }

  getTotalAppointmentToday(): Observable<IAppointmentTotalInfo> {
    return this._apiService.get(routes.getTotalAppointmentTodayUrl);
  }

  getAppointments(params: IAppointmentGetRequest): Observable<IScrollResponse<IAppointmentInfo>> {
    const newParams = this._utilService.buildParams(params);
    return this._apiService.get(routes.getAppointmentsUrl, newParams);
  }

  getAppointment(appointmentId : number): Observable<IAppointmentInfo> {
    return this._apiService.get(routes.getAppointmentUrl(appointmentId));
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this._apiService.put(routes.cancelAppointmentUrl(appointmentId));
  }

  getPendingCallAppointment(): Observable<any> {
    return this._apiService.get(routes.getPendingCallAppointmentUrl);
  }

  getVisitHistories(patientId : number): Observable<VisitHistory[]> {
    return this._apiService.get(routes.getVisitHistoriesUrl(patientId));
  }

  getAppointmentSoapNote(appointmentId : number): Observable<SoapNote> {
    return this._apiService.get(routes.getAppointmentSoapNoteUrl(appointmentId));
  }

  upsertAppointmentSoapNote(request : SoapNote): Observable<SoapNote> {
    return this._apiService.post(routes.upsertAppointmentSoapNoteUrl, request);
  }

  getOpenTokSession(roomName: string): Observable<OpenTokSessionInfo> {
    const request = {
      "roomName" : roomName
    };

    return this._apiService.post(routes.getOpenTokSessionUrl, request);
  }
}
