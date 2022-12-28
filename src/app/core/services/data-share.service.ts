import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  private messageSource: BehaviorSubject<any>;
  currentMessage: Observable<any>;

  public doctorProfile: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public data: Observable<any> = this.doctorProfile.asObservable();

  public soapData: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public soap: Observable<any> = this.soapData.asObservable();

  constructor() {
    this.messageSource = new BehaviorSubject(0);
    this.currentMessage = this.messageSource.asObservable();
  }

  changeMessage(messageType: any) {
    this.messageSource.next(messageType);
  }

  public updateDoctorInfo(data: any): void {
    this.doctorProfile.next(data);
  }

  public getUserInfo(): any {
    return this.doctorProfile.getValue();
  }

  public updateSoapData(data: any): void {
    this.soapData.next(data);
  }

  public getSoapData(): any {
    return this.soapData.getValue();
  }
}