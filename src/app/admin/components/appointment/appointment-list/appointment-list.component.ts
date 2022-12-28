import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, ViewRef } from '@angular/core';
import { IAppointmentInfo } from '@app/models/interfaces/videocall.interface';
import { ActionConfirmDialogComponent } from '@app/admin/components/dialogs/action-confirm/action-confirm.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { IPopupInfo, TimeSpan } from '@app/models/interfaces/common.interface';
import { Router } from '@angular/router';
import { EAppointmentStatus } from '@app/models/enums/appointment-status.enum';
import { Interval, useInterval } from '@app/core/utils/timer.util';
import { BackShareService } from '@app/core/services/back-share.service';
import { SoapDialogComponent } from '../../dialogs/soap-dialog/soap-dialog.component';
import { StateService } from '@app/core/services/state.service';
import { DoctorApiService } from '@app/core/services/api/doctor-api.service';
import { EazyscriptAuthToken, EazyscriptPresecriptionParams } from '@app/models/interfaces/doctor.interface';
import { PrescriptionDialogComponent } from '../../dialogs/prescription-dialog/prescription-dialog.component';
import { AuthService } from '@app/core/services/auth.service';


@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent {
  destroyed$ = new Subject();
  subscriptions: Subscription[] = [];
  @Input() appointments: IAppointmentInfo[] = [];
  @Input() status: string;
  @Input() hasData: boolean;
  @Input() isProcessing: boolean;
  @Output() scroll: EventEmitter<any> = new EventEmitter();
  @Output() cancelAppointment: EventEmitter<any> = new EventEmitter();
  @Output() viewProfile: EventEmitter<number> = new EventEmitter();
  totalSecondShowCountDown = 24 * 60 * 60;
  totalSecondChangeAction = 15 * 60;
  intervalReset = 120;
  interval: Interval;
  currentRxDialog: MatDialogRef<PrescriptionDialogComponent, any>;
  public noAvatar = 'assets/images/users/no-avatar.png';
  constructor(private _dialog: MatDialog,   
    private _backShareService: BackShareService, 
    private _router: Router,    
    private _stateService: StateService,
    private _doctorService: DoctorApiService,
    private _authService: AuthService,
    private _changeDetector: ChangeDetectorRef) { 
    }

  ngOnDestroy() {
    this.destroyed$.next(null);
    this.destroyed$.complete();
    if (this.interval) {
      this.interval.stop();
    }
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
   });
  }

  ngAfterViewChecked() {
    let countInterval = 0;
    if (!this.interval) {
      this.interval = useInterval(() => {
        countInterval += 1;
        //console.log(countInterval);
        this.resetOnIntevalAppointment();
        if (!(this._changeDetector as ViewRef).destroyed) {
          this._changeDetector.detectChanges();
        }

        if (countInterval >= this.intervalReset) {
          countInterval = 0;
          this.interval.restart();
        }
      }, 1000);

      this.interval.start();

      this._changeDetector.detectChanges();
    }
  }
  resetOnIntevalAppointment() {
    if (this.status === EAppointmentStatus.UpComing && !this.isProcessing) {
      this.appointments = this.appointments.filter((appointment) => new Date(appointment.endTime) >= new Date());
    }
  }

  getElapsedTime(entry: IAppointmentInfo): TimeSpan | undefined {
    if ((this.status !== EAppointmentStatus.UpComing)) {
      return undefined;
    }
    const totalSecondEndTime = Math.floor((new Date(entry.endTime).getTime() - new Date().getTime()) / 1000);
    let totalSeconds = Math.floor((new Date(entry.time).getTime() - new Date().getTime()) / 1000);

    if (totalSecondEndTime > 0 && totalSeconds < this.totalSecondChangeAction) {
      entry.canStart = true;
    }

    if (totalSeconds > this.totalSecondShowCountDown) {
      return undefined;
    }

    if (totalSeconds <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);
      totalSeconds -= 3600 * hours;
    }

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }

    seconds = totalSeconds;

    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  onScroll($event: any): void {
    if ($event.target.offsetHeight + $event.target.scrollTop >= $event.target.scrollHeight - 1) {
      this.scroll.emit();
    }
  }

  onCancelAppointment(appointmentId: number): void {
    const popupInfo: IPopupInfo = {
      btnCancelText: 'CANCEL',
      btnOkText: 'OK',
      content: 'Are you sure you want to cancel this appointment?',
      headerText: 'Cancel Appointment'
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
      this.cancelAppointment.emit(appointmentId);
    });
  }

  onStartCall(appointment: IAppointmentInfo): void {
    this._stateService.videoCallPublisherAudioIsOn.next(true);
    this._stateService.videoCallPublisherVideoIsOn.next(true);
    this._router.navigate(['video-chat'], { queryParams: { roomName: appointment.roomName, appointmentId: appointment.id, patientId: appointment.patient.id } });
  }

  onViewProfile(appointment: IAppointmentInfo): void {
    this.viewProfile.emit(appointment.patient.id);
    this._backShareService.change(true);
  }

  addPrescription(patientEazyscriptId?: number) {
    let currentDoctor = this._authService.getUser();
    if(!currentDoctor.eazyScriptId) {
      const popupInfo: IPopupInfo = {
        btnCancelText: 'Close',
        btnOkText: '',
        content: "Current presciber doesn't have an Eazyscript account.",
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

    if(patientEazyscriptId) {
      let authToken: EazyscriptAuthToken = null as any;
      let eazyScriptAuthSub =  this._doctorService.getEazyscriptAuthToken().subscribe(authData => {
        let presecriptionParams: EazyscriptPresecriptionParams = {
          eazyscriptPatientId: patientEazyscriptId,
          doctorAuthToken: authData
        };

        if(!authData.isVerifiedIDMe) {
          const popupInfo: IPopupInfo = {
            btnCancelText: 'Close',
            btnOkText: 'Continue',
            content: "Current prescriber account does not verify ID.Me. Please click “Continue” to complete your ID.Me verification before you are able to prescribe.",
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
      });
      this.subscriptions.push(eazyScriptAuthSub);
    }
    else {
      const popupInfo: IPopupInfo = {
        btnCancelText: 'Close',
        btnOkText: '',
        content: "This patient doesn't have an Eazyscript account.",
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

  showNewPrescription(presecriptionParams: EazyscriptPresecriptionParams) {
    this.currentRxDialog = this._dialog.open(
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

  @HostListener('window:message', ['$event'])
  onPostMessage(event: any) {
    if(event?.data == "Close-RX") {
      if(this.currentRxDialog) {
        //this.currentRxDialog.close();
        //console.log("postMessage receive data : " + event.data);
        //alert("Close RX");
      }
    }

    /*
    let closeRx = localStorage.getItem("Close-RX");
    if(closeRx) {
      this.currentRxDialog.close();
      alert("Close RX");
      localStorage.removeItem("Close-RX");
    }
    */

  }
  
}
