import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {IPatientInfo, IUserInfo } from '@interfaces/users.interface';
import { DoctorApiService } from './api/doctor-api.service';
//import { IDoctorSchedulerData } from '@app/models/interfaces/doctor.interface';
import { IVitalSignResponse } from '@app/models/interfaces/vital.interface';
import { ChangePassword, EazyscriptAuthToken, IDoctorSchedulerData } from '@app/models/interfaces/doctor.interface';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private _doctorApiService: DoctorApiService,
  ) { }
  
  getPatientInfo(userId: number): Observable<IPatientInfo> {
    return this._doctorApiService.getPatientInfo(userId);
  }

  getDoctorProfile(): Observable<IUserInfo> {
    return this._doctorApiService.getDoctorProfile();
  }

  updateDoctorProfile(data: IUserInfo): Observable<any> {
    return this._doctorApiService.updateDoctorProfile(data);
  }

  getDoctorSchedulers(): Observable<IDoctorSchedulerData> {
    return this._doctorApiService.getDoctorSchedulers();
  }

  getVitals(userId: number): Observable<IVitalSignResponse[]> {
    return this._doctorApiService.getVitals(userId);
  }

  changePassword(changePassword: ChangePassword): Observable<any> {
    return this._doctorApiService.changePassword(changePassword);
  }

  getEazyscriptAuthToken(): Observable<EazyscriptAuthToken> {
    return this._doctorApiService.getEazyscriptAuthToken();
  }
  
  getSpecialties(): Observable<any> {
    return this._doctorApiService.getSpecialties();
  }

  changeAvatar(file: any): Observable<any> {
    return this._doctorApiService.changeAvatarApi(file);
  }

  checkAndUpdateIDMe(): Observable<any> {
    return this._doctorApiService.checkAndUpdateIDMe();
  }
}
