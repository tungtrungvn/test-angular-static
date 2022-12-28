import { DOCUMENT } from '@angular/common';
import {
  Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef,
  AfterViewInit, ViewEncapsulation, ViewChildren,
  QueryList, Inject, HostListener, OnDestroy, AfterViewChecked
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublisherComponent } from '@app/admin/components/video-chat/publisher/publisher.component';
import { OpentokService } from '@app/core/services/opentok.service';
import { EndVisitData, IAppointmentInfo, OpenTokSessionInfo } from '@app/models/interfaces/videocall.interface';
import * as OT from '@opentok/client';
import { MatDialog } from '@angular/material/dialog';
import { ActionConfirmDialogComponent } from '@app/admin/components/dialogs/action-confirm/action-confirm.component';
import { IPopupInfo } from '@app/models/interfaces/common.interface';
import { DoctorApiService } from '@app/core/services/api/doctor-api.service';
import { IPatientInfo, IUserInfo } from '@app/models/interfaces/users.interface';
import { StateService } from '@app/core/services/state.service';
import { VideoService } from '@app/core/services/video.service';
import { EAppointmentStatus } from '@app/models/enums/appointment-status.enum';
import {DateUltil} from '@app/core/utils/date.util';
import { AuthService } from '@app/core/services/auth.service';
import { BackShareService } from '@app/core/services/back-share.service';
import { UtilService } from '@app/core/services/util.service';
import { SubscriberComponent } from '@app/admin/components/video-chat/subscriber/subscriber.component';
import { Subscription } from 'rxjs';
import { PrescriptionDialogComponent } from '@app/admin/components/dialogs/prescription-dialog/prescription-dialog.component';
import { EazyscriptAuthToken, EazyscriptPresecriptionParams } from '@app/models/interfaces/doctor.interface';
import { DataShareService } from '@app/core/services/data-share.service';



@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoChatComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  title = 'Doctor Platform - Video Chat';
  session: OT.Session;
  streams: Array<OT.Stream> = [];
  stream: OT.Stream;
  changeDetectorRef: ChangeDetectorRef;
  message = '';
  soapData: any;
  waitingMessage = 'Waiting for patient ...';
  @ViewChild('waitingScreen', { static: false }) waitingScreen: ElementRef;
  @ViewChild('videoContainer', { static: false }) videoContainer: ElementRef;
  @ViewChild('videoToolbar', { static: false }) videoToolbar: ElementRef;
  @ViewChild('videoSubscriber', { static: false }) videoSubscriber: ElementRef;
  @ViewChild('videoPublisher', { static: false }) videoPublisher: ElementRef;
  @ViewChild('chatContainer', { static: true }) chatContainer: ElementRef;
  @ViewChild('soapNoteContainer', { static: true }) soapNoteContainer: ElementRef;
  @ViewChildren('icon') icons: QueryList<ElementRef>;
  @ViewChildren('container') containers: QueryList<ElementRef>;
  @ViewChild(PublisherComponent, { static: false }) publisher: PublisherComponent;
  @ViewChild(SubscriberComponent) subscriber: SubscriberComponent;

  counter: string;
  timer: any;
  connected = false;
  _self = this;
  roomName: string;
  appointmentId: number;
  patientId: number;
  audioIsOn = false;
  videoIsOn = false;
  isInCall = true;
  hasUserMedia: boolean;
  isFullScreenMode = false;
  patientInfo: IPatientInfo;
  isEndedVisit: boolean;
  componentHasInit: boolean;
  isPendingCall: true;
  doctorInfor: IUserInfo;
  showPatientProfile = false;
  subscriptions: Subscription[] = [];
  checkVideoRender = false;
  checkSubscriberRender = false;
  showChat = false;

  constructor(private ref: ChangeDetectorRef, private elementRef: ElementRef,
              private _opentokService: OpentokService,
              private _route: ActivatedRoute,
              private _router: Router,
              @Inject(DOCUMENT) private _document: any,
              private _dialog: MatDialog,
              private _doctorService: DoctorApiService,
              private _stateService: StateService,
              private _videoService: VideoService,
              private _authService: AuthService,
              private _backShareService: BackShareService,
              private _utilService: UtilService,
              private _dataShareService: DataShareService
    ) {
      this._stateService.showPatientInfoInHeader.next(true);
      this.changeDetectorRef = ref;
      // Load url params
      const getUrlParams = this._utilService.getUrlParams().subscribe((params) => {
        this.roomName = params?.find(x => x.key === 'roomname')?.value;
        this.appointmentId = params?.find(x => x.key === 'appointmentid')?.value;
        this.patientId = params?.find(x => x.key === 'patientid')?.value;
        this.isPendingCall = params?.find(x => x.key === 'pendingcall')?.value;
      });
      this.subscriptions.push(getUrlParams);

      this.getPatientInfo();
  }

  ngAfterViewInit(): void {
    this.startTimer();
    const getAppointment = this._videoService.getAppointment(this.appointmentId).subscribe((app: IAppointmentInfo) => {
      if (app) {
        const theDateTime = DateUltil.addMinutesToDate(new Date(), 15);
        const appTime = new Date(app.time);
        if (app.status === EAppointmentStatus.DroppedCall
          && appTime < theDateTime && app.appointmentCallId > 0
          && app.doctorJoinedAt)
          {
            this.isPendingCall = true;
          }
      }
    });

    this.subscriptions.push(getAppointment);
  }

  ngAfterViewChecked(): void {
    if (!this.checkVideoRender && this.publisher) {
      this.audioIsOn = this._stateService.videoCallPublisherAudioIsOn.value;
      this.publisher.setAudio(this.audioIsOn);
      this.videoIsOn = this._stateService.videoCallPublisherVideoIsOn.value;
      this.publisher.setVideo(this.videoIsOn);
      this.checkVideoRender = true;
    }

    if (!this.checkSubscriberRender && this.subscriber) {
      const subscriberAudioIsOn = this._stateService.videoCallSubscriberAudioIsOn.value;
      this.subscriber.setAudio(subscriberAudioIsOn);
      this.checkSubscriberRender = true;
    }
    if (this.isPendingCall && this.videoToolbar) {
      this.showChat = true;      
      // Hide video toolbar when Doctor rejoin
      //this.videoToolbar.nativeElement.classList.add('d-none');
    }
  }

  ngOnInit() {
    this._stateService.isVideoCallScreen.next(true);
    this.componentHasInit = true;
    this.doctorInfor = this._authService.getUser();

    const showPatientProfileInVideoCallScreen = this._stateService.showPatientProfileInVideoCallScreen.subscribe(value => {
      this.showPatientProfile = value;
      if (!value) {
        this.initSession();
      }
    });
    this.subscriptions.push(showPatientProfileInVideoCallScreen);
  }

  ngOnDestroy() {
    if (this.componentHasInit) {
      this._stateService.isVideoCallScreen.next(false);
      this._stateService.patientInfo.next(null as any);
      this._stateService.showPatientInfoInHeader.next(false);
      this._stateService.headerInWhite.next(false);
      if (!this.isEndedVisit) {
        if (this.publisher) {
          this.publisher.setVideo(false);
          this.publisher.setAudio(false);
          this.publisher.destroy();
        }
        if (this.session) {
          this.session.disconnect();
        }
        if (this.streams.length > 0) {
          this.stream = this.streams[0];
          this.streams = [];
        }
      }

      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
     });
    }
  }

  initSession(): void {
    this._opentokService.getOpenTokSession(this.roomName).subscribe(
      (response: OpenTokSessionInfo) => {
        this.session = OT.initSession(response.apiKey, response.sessionId);

        this.connect(response.token);
        this.connected = true;
        // Restore publisher's audio and video

        if (this.publisher) {
          this.audioIsOn = this._stateService.videoCallPublisherAudioIsOn.value;
          this.publisher.setAudio(this.audioIsOn);
          this.videoIsOn = this._stateService.videoCallPublisherVideoIsOn.value;
          this.publisher.setVideo(this.videoIsOn);
        }

        this.session.on('streamCreated', (event) => {
          if (this.streams.length < 1) {
            this.streams.push(event.stream);
          }
          this.changeDetectorRef.detectChanges();
        });

        this.session.on('streamDestroyed', (event) => {
          const idx = this.streams.indexOf(event.stream);
          if (idx > -1) {
            this.streams.splice(idx, 1);
            this.changeDetectorRef.detectChanges();
          }
          this.waitingMessage = 'The video portion of this visit has ended. Please complete your notes and end the visit.';
        });
      },
      (err) => {
        console.log('Unable to connect. Make sure you have updated the config.ts file with your OpenTok details.');
        console.log(err);
      }
    );
  }

  connect(token: string): any {
    return new Promise((resolve, reject) => {
      this.session.connect(token, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.session);
        }
      });
    });
  }

  disConnect() {
    this.session.disconnect();
  }
  startTimer(): void {
    let sencond = 0;
    let sencondStr = '00';
    let minute = 0;
    let minuteStr = '00';
    this.timer = setInterval(() => {
      sencond += 1;
      if (sencond == 60) {
        minute += 1;
        sencond = 0;
      }
      sencondStr = sencond >= 10 ? sencond.toString() : `0${sencond}`;
      minuteStr = minute >= 10 ? minute.toString() : `0${minute}`;
      this.counter = `${minuteStr}:${sencondStr}`;
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.timer);
    this.timer = null;
    this.counter = '00:00';
  }

  toggleAudio(): void {
    const value = this.publisher.audioIsOn;
    this.publisher.setAudio(!value);
    this.audioIsOn = this.publisher.audioIsOn;
    this._stateService.videoCallPublisherAudioIsOn.next(!value);
  }

  toggleVideo(): void {
    const value = this.publisher.videoIsOn;
    this.publisher.setVideo(!value);
    this.videoIsOn = this.publisher.videoIsOn;
    this._stateService.videoCallPublisherVideoIsOn.next(!value);
  }

  dropCall(): void {
    if (this.isInCall) {
      if (this.publisher) {
        this.publisher.setVideo(false);
        this.publisher.setAudio(false);
        this.publisher.destroy();
      }

      if (this.streams.length > 0) {
        this.stream = this.streams[0];
        this.streams = [];
      }
      this.waitingMessage = 'The video portion of this visit has ended. Please complete your notes and end the visit.';
      this.stopTimer();
      // Hide video toolbar when Doctor drop call
      this.videoToolbar.nativeElement.classList.add('d-none');
      this.showChat = true;
      this.isPendingCall = true;
      /*
      this._opentokService.dropCall(this.appointmentId).subscribe(result => {
        // send notification to Patient
        this.session.signal({
          type: 'drop',
          data: ''
        }, (error) => {
          if (error) {
            console.log('ERROR sending signal:', error.name, error.message);
          } else {
            // Disconnect session
            this.session.disconnect();
          }
        });
      });
      */

      // send notification to Patient
      this.session.signal({
        type: 'drop',
        data: ''
      }, (error) => {
        if (error) {
          console.log('ERROR sending signal:', error.name, error.message);
        } else {
          // Disconnect session
          this.session.disconnect();
        }
      });

              
    }
    else {
      this.publisher.ngAfterViewInit();
      this.streams.push(this.stream);
      this.waitingMessage = 'Waiting for patient ...';
      this.startTimer();
    }
    this.isInCall = !this.isInCall;
  }

  endVisit(): void {
    const popupInfo: IPopupInfo = {
      btnCancelText: 'NO',
      btnOkText: 'YES',
      content: 'Don\'t forgot to add SOAP Note before leaving. Do you want to end this call visit?',
      headerText: 'End Visit'
    };
    const dialogRef = this._dialog.open(
      ActionConfirmDialogComponent,
      {
        panelClass: 'custom-dialog',
        width: '400px',
        data: popupInfo
      }
    );
    dialogRef.componentInstance.onDialogSubmit.subscribe(() => {
      this.isEndedVisit = true;
      // Notify ending session to patient
      this.session.signal({
        type: 'end',
        data: ''
      }, (error) => {
        if (error) {
          console.log('ERROR sending signal:', error.name, error.message);
        } else {
          // Disconnect session
          if (this.publisher) {
            this.publisher.destroy();
          }
          if (this.session) {
            this.session.disconnect();
          }
          if (this.streams.length > 0) {
            this.stream = this.streams[0];
            this.streams = [];
          }
        }
      });

      const endVisitData: EndVisitData = {
        appointmentId: this.appointmentId,
        patientId: this.patientId,
        subjective: this.soapData?.subjective,
        objective: this.soapData?.objective,
        assessment: this.soapData?.assessment,
        plan: this.soapData?.plan
      };

      this._opentokService.endVisit(endVisitData).then(() => {
        this._router.navigate(['appointment']);
      });
    });

    this._dataShareService.updateSoapData(0);
  }

  onSoapDataChange(soapData: any) {
    this.soapData = soapData;
    this._dataShareService.updateSoapData(soapData);
  }

  openFullscreen() {
    if (this._document.documentElement.requestFullscreen) {
      this._document.documentElement.requestFullscreen();
    } else if (this._document.documentElement.mozRequestFullScreen) {
      this._document.documentElement.mozRequestFullScreen();
    } else if (this._document.documentElement.webkitRequestFullscreen) {
      this._document.documentElement.webkitRequestFullscreen();
    } else if (this._document.documentElement.msRequestFullscreen) {
      this._document.documentElement.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    if (this._document.documentElement.exitFullscreen) {
      this._document.exitFullscreen();
    } else if (this._document.mozCancelFullScreen) {
      this._document.mozCancelFullScreen();
    } else if (this._document.webkitExitFullscreen) {
      this._document.webkitExitFullscreen();
    } else if (this._document.msExitFullscreen) {
      this._document.msExitFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullScreenChange(event: any) {
    if (!this.isFullScreenMode) {
      this.videoToolbar.nativeElement.classList.add('d-none');
      // this.videoSubscriber
      this.videoContainer.nativeElement.style.top = '0px';
      this.videoContainer.nativeElement.style.left = '0px';
      this.videoContainer.nativeElement.style.position = 'absolute';
      this.videoContainer.nativeElement.style.width = '100%';
      this.videoContainer.nativeElement.style.height = '100%';
      this.videoContainer.nativeElement.style.zIndex = '9999';
      this._document.getElementById('videoPublisher').style.marginBottom = '75px';
      this._document.getElementById('videoPublisher').style.marginLeft = '35px';
    }
    else {
      this.videoToolbar.nativeElement.classList.remove('d-none');
      this.videoContainer.nativeElement.style.top = '';
      this.videoContainer.nativeElement.style.left = '';
      this.videoContainer.nativeElement.style.position = '';
      this.videoContainer.nativeElement.style.width = '';
      this.videoContainer.nativeElement.style.height = '';
      this.videoContainer.nativeElement.style.zIndex = 'auto';
      this._document.getElementById('videoPublisher').style.marginBottom = '';
      this._document.getElementById('videoPublisher').style.marginLeft = '';
    }
    this.isFullScreenMode = !this.isFullScreenMode;
  }

  async getPatientInfo() {
    this._doctorService.getPatientInfo(this.patientId).subscribe(
      (response: IPatientInfo) => {
        this.patientInfo = response;
        this._stateService.patientInfo.next(response);
        this._stateService.headerInWhite.next(true);
      }
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeWindowUnload(event: Event) {
    event.preventDefault();
    event.returnValue = false;
  }

  gotoPatientProfile(): void {
    if (this.publisher) {
      this.publisher.setAudio(false);
      this.publisher.setVideo(false);
      this.publisher.destroy();
    }
    if (this.session) {
      this.session.disconnect();
    }
    if (this.streams.length > 0) {
      this.stream = this.streams[0];
      this.streams = [];
    }

    this._backShareService.change(true);
    this._stateService.headerInWhite.next(false);
    this._stateService.showPatientProfileInVideoCallScreen.next(true);
    this._stateService.showPatientInfoInHeader.next(false);
  }

  // Listen to subscriber's audio event
  subscriberAudioIsMuted(value: boolean) {
    this._stateService.videoCallSubscriberAudioIsOn.next(!value);
    // this.audioIsOn = !value;
  }

  // Listen to publisher's audio event
  publisherAudioIsMuted(value: boolean) {
    this._stateService.videoCallPublisherVideoIsOn.next(!value);
    this.audioIsOn = !value;
  }

  addPrescription() {
    if (!this.doctorInfor.eazyScriptId) {
      const popupInfo: IPopupInfo = {
        btnCancelText: 'Close',
        btnOkText: '',
        content: 'Current presciber doesn\'t have an Eazyscript account.',
        headerText: 'Eazyscript account'
      };
      const dialogRef = this._dialog.open(
        ActionConfirmDialogComponent,
        {
          panelClass: 'custom-dialog',
          width: '400px',
          data: popupInfo
        }
      );

      return;
    }

    if (this.patientInfo.eazyscriptId) {
      const authToken: EazyscriptAuthToken = null as any;
      const eazyScriptAuthSub =  this._doctorService.getEazyscriptAuthToken().subscribe(authData => {
        const presecriptionParams: EazyscriptPresecriptionParams = {
          eazyscriptPatientId: this.patientInfo.eazyscriptId,
          doctorAuthToken: authData
        };

        if (!authData.isVerifiedIDMe) {
          const popupInfo: IPopupInfo = {
            btnCancelText: 'Close',
            btnOkText: 'Continue',
            content: 'Current prescriber account does not verify ID.Me. Please click “Continue” to complete your ID.Me verification before you are able to prescribe.',
            headerText: 'ID.Me verification'
          };
          const dialogRef = this._dialog.open(
            ActionConfirmDialogComponent,
            {
              panelClass: 'custom-dialog',
              width: '400px',
              data: popupInfo
            }
          );
          dialogRef.componentInstance.onDialogSubmit.subscribe(() => {
            this.showNewPrescription(presecriptionParams);
          });
        }
        else {
          this.showNewPrescription(presecriptionParams);
        }

        /*
        let presecriptionParams: EazyscriptPresecriptionParams = {
          eazyscriptPatientId: this.patientInfo.eazyscriptId,
          doctorAuthToken: authToken
        };
        const dialogRef = this._dialog.open(
          PrescriptionDialogComponent,
          {
            height: '80%',
            width: '70%',
            maxWidth: '70vw',
            maxHeight: '80vh',
            data: presecriptionParams
          }
        );
        */
      });
      this.subscriptions.push(eazyScriptAuthSub);
    }
    else {
      const popupInfo: IPopupInfo = {
        btnCancelText: 'Close',
        btnOkText: '',
        content: 'This patient doesn\'t have an Eazyscript account.',
        headerText: 'Add prescription'
      };
      const dialogRef = this._dialog.open(
        ActionConfirmDialogComponent,
        {
          panelClass: 'custom-dialog',
          width: '400px',
          data: popupInfo
        }
      );
    }
  }

  switchBetweenVideoAndChat(): void {
    this.showChat = !this.showChat;
  }

  showNewPrescription(presecriptionParams: EazyscriptPresecriptionParams) {
    const dialogRef = this._dialog.open(
      PrescriptionDialogComponent,
      {
        height: '80%',
        width: '70%',
        maxWidth: '70vw',
        maxHeight: '80vh',
        data: presecriptionParams
      }
    );
  }
}

