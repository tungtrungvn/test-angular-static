import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {IUserInfo } from '@interfaces/users.interface';
import { AccountApiService } from './api/account-api.service';
import { IVitalSignResponse } from '@app/models/interfaces/vital.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private accountApiService: AccountApiService,
  ) { }

  getPatientProfile(patientId?: number): Observable<IUserInfo> {
    return this.accountApiService.getPatientProfile(patientId);
  }

  getVitals(patientId?: number, codes?: string[]): Observable<IVitalSignResponse[]> {
    return this.accountApiService.getVitals(patientId, codes);
  }
}
