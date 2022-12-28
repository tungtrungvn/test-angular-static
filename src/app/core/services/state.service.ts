import { Injectable } from '@angular/core';
import { IPatientInfo } from '@app/models/interfaces/users.interface';
import {BehaviorSubject, map, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public patientInfo = new BehaviorSubject<IPatientInfo>(null as any);
  public headerInWhite = new BehaviorSubject<boolean>(false);
  public isVideoCallScreen = new BehaviorSubject<boolean>(false);
  public showPatientProfileInVideoCallScreen = new BehaviorSubject<boolean>(false);
  public showPatientInfoInHeader = new BehaviorSubject<boolean>(false);
  public videoCallPublisherAudioIsOn = new BehaviorSubject<boolean>(false);
  public videoCallPublisherVideoIsOn = new BehaviorSubject<boolean>(false);
  public videoCallSubscriberAudioIsOn = new BehaviorSubject<boolean>(true);
  public videoCallSubscriberVideoIsOn = new BehaviorSubject<boolean>(true);
  public headerHeight = new BehaviorSubject<number>(0);
  public backBtnText = new Subject<string | null>();
  public backActions = new Subject<any>();

  constructor() { }

}
