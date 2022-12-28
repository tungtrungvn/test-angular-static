import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from '@core/services/util.service';
import { IUserInfo } from '@interfaces/users.interface';
import { IVitalSignResponse } from '@app/models/interfaces/vital.interface';

const routes = {
  getPatientProfileUrl: (patientId?: number) => `/account/get-patient-profile?patientId=${patientId}`,
  getVitalsUrl: '/account/get-vitals'
};


@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(
    private apiService: ApiService,
    private utilService: UtilService
  ) { }

  getPatientProfile(patientId?: number): Observable<IUserInfo> {
    return this.apiService.get(routes.getPatientProfileUrl(patientId));
  }


  getVitals(patientId?: number, codes?: string[]): Observable<IVitalSignResponse[]> {
    const params = {
      patientId,
      codes
    };
    const newParams = this.utilService.buildParams(params);
    return this.apiService.get(routes.getVitalsUrl, newParams);
  }
}
