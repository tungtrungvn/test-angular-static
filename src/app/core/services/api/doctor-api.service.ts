import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {IVitalChartResponse, IVitalSignResponse} from '@app/models/interfaces/vital.interface';
import { UtilService } from '@core/services/util.service';
import { IPatientInfo, IUserInfo } from '@interfaces/users.interface';
import { ChangePassword, EazyscriptAuthToken, IDoctorSchedulerData } from '@app/models/interfaces/doctor.interface';
import { IFileResponse } from '@app/models/interfaces/file.interface';
import { HttpParams } from '@angular/common/http';

const routes = {
  doctorProfile: '/doctor/doctor-profile',
  updatedoctorProfile: '/doctor/doctor-profile',
  getPatientInfoUrl: (userId: number) => `/doctor/patient-profile?userId=${userId}`,
  getSchedulerUrl: '/doctor/schedulers',
  getPatientVitalsUrl: (userId: number) => `/doctor/patient-vitals?userId=${userId}`,
  changePasswordUrl: '/doctor/change-password',
  eazyscriptAuthToken: '/doctor/eazyscript-token',
  getSpecialties: '/doctor/doctor-specialties',
  changeAvatar: '/doctor/update-avatar',
  checkAndUpdateIDMe: '/doctor/check-and-update-idme'
};


@Injectable({
  providedIn: 'root'
})
export class DoctorApiService {

  constructor(
      private _apiService: ApiService
  ) {
  }

  getPatientInfo(userId: number): Observable<IPatientInfo> {
    return this._apiService.get(routes.getPatientInfoUrl(userId));
  }

  getDoctorProfile(): Observable<IUserInfo> {
    return this._apiService.get(routes.doctorProfile);
  }

  updateDoctorProfile(data: IUserInfo): Observable<any> {
    return this._apiService.put(routes.updatedoctorProfile, data);
  }

  getDoctorSchedulers(): Observable<IDoctorSchedulerData> {
    return this._apiService.get(routes.getSchedulerUrl);
  }

  getVitals(userId: number): Observable<IVitalSignResponse[]> {
    return this._apiService.get(routes.getPatientVitalsUrl(userId));
  }

  changePassword(changePassword: ChangePassword): Observable<any> {
    return this._apiService.post(routes.changePasswordUrl, changePassword);
  }

  getEazyscriptAuthToken(): Observable<EazyscriptAuthToken> {
    return this._apiService.get(routes.eazyscriptAuthToken);
  }

  getSpecialties(): Observable<any[]> {
    return this._apiService.get(routes.getSpecialties);
  }

  changeAvatarApi(file: any): Observable<IFileResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this._apiService.putFormData(routes.changeAvatar, formData);
  }

  checkAndUpdateIDMe(): Observable<any> {
    return this._apiService.put(routes.checkAndUpdateIDMe);
  }
}
