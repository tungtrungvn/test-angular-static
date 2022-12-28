import { formatDate } from '@angular/common';
import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { VideoService } from '@app/core/services/video.service';
import { DateUltil } from '@app/core/utils/date.util';
import { IScrollResponse } from '@app/models/interfaces/common.interface';
import { EndVisitData, IAppointmentGetRequest, IAppointmentInfo, OpenTokSessionInfo, PendingCallAppointment } from '@app/models/interfaces/videocall.interface';
import { EAppointmentNotificationType, EAppointmentStatus } from '@app/models/enums/appointment-status.enum';
import { NotificationService } from '@core/services/notification.service';
import { DataShareService } from '@app/core/services/data-share.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PendingCallDialogComponent } from '@app/admin/components/dialogs/pending-call-dialog/pending-call-dialog.component';
import { OpentokService } from '@app/core/services/opentok.service';
import { BackShareService } from '@app/core/services/back-share.service';
import { StateService } from '@app/core/services/state.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit, AfterViewInit {
  appointments: IAppointmentInfo[] = [];
  start = DateUltil.startOfMonth();
  end = DateUltil.endOfMonth();
  take = 20;
  hasMore = false;
  hasData = true;
  isProcessing = false;
  status: string = EAppointmentStatus.UpComing;
  range = new FormGroup({
    start: new FormControl<Date | null>(DateUltil.startOfMonth()),
    end: new FormControl<Date | null>(DateUltil.endOfMonth()),
  });
  viewUserId?: number;
  filterAppointment: string = '';

  @ViewChild('appointmentPage') appointmentPage: ElementRef<HTMLDivElement>;
  @ViewChild('appList') appList: ElementRef<HTMLDivElement>;
  @ViewChild('appFilter') appFilter: ElementRef<HTMLDivElement>;

  constructor(private _videoService: VideoService,
              private _backShareService: BackShareService,
              private _dataShareService: DataShareService,
              private _notificationService: NotificationService,
              private _opentokService: OpentokService,
              private _dialog: MatDialog,
              private _stateService: StateService,
              private _router: Router) {
      this.viewUserId = undefined;
      this._backShareService.change(false);
  }

  ngAfterViewInit(): void {
    this.calculatorHeight();
  }

  calculatorHeight(): void {
    if (this.appList) {
      this.appList.nativeElement.style.height = `calc(100% - ${this.appFilter.nativeElement.offsetHeight}px)`;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.calculatorHeight();
  }

  ngOnInit(): void {
    this.getAppointments(true);

    this._backShareService.current.subscribe(isOpen => {
      if (!isOpen) {
        this.viewUserId = undefined;
      }
      setTimeout(() => {
        this.calculatorHeight();
      });
    });

    this._dataShareService.currentMessage.subscribe(data => {
      const messageType = data?.notificationType;
      if (!messageType) {
        return;
      }
      const message = data.message;
      if (messageType < EAppointmentNotificationType.NewAppointment
        || messageType > EAppointmentNotificationType.CancelAppointment) {
        return;
      }
      if (this.status === EAppointmentStatus.UpComing) {
        this.getAppointments(true);
        this._notificationService.success(message);
      } else if (this.status === EAppointmentStatus.Cancelled
        && messageType === EAppointmentNotificationType.CancelAppointment) {
        this.getAppointments(true);
        this._notificationService.success(message);
      }
      this._dataShareService.changeMessage(null);
    });

    this._videoService.getPendingCallAppointment().subscribe((appointment: PendingCallAppointment) => {
      if (appointment) {
        const dialogRef = this._dialog.open(
          PendingCallDialogComponent,
          {
            panelClass: 'custom-dialog',
            width: '500px',
            data: appointment
          }
        );
        dialogRef.disableClose = true;

        dialogRef.componentInstance.onRejoinSubmit.subscribe(() => {
          this._stateService.videoCallPublisherAudioIsOn.next(true);
          this._stateService.videoCallPublisherVideoIsOn.next(true);
          this._router.navigate(['video-chat'], { queryParams: { roomName: appointment.roomName, appointmentId: appointment.appointmentId,
                                                  patientId: appointment.patientId } });
        });

        dialogRef.componentInstance.onEndSubmit.subscribe(() => {
          // End call visit
          const endVisitData: EndVisitData = {
            appointmentId: appointment.appointmentId,
            patientId: appointment.patientId,
            subjective: '',
            objective: '',
            assessment: '',
            plan: ''
          };


          this._opentokService.endVisit(endVisitData).then(() => {
            // Reload list appointments
            this.getAppointments(true);

            // Kick out the patient from the waiting room

            this._opentokService.getOpenTokSession(appointment.roomName).subscribe(
              (response: OpenTokSessionInfo) => {
                const session = OT.initSession(response.apiKey, response.sessionId);
                session.connect(this._opentokService.token, (err) => {
                  if (err) {
                    console.log(`session.connect : ${err});
                    }`);
                  }
                  else {
                    // Notify ending session to patient
                    session.signal({
                      type: 'end',
                      data: ''
                    }, (error) => {
                      if (error) {
                        console.log('ERROR sending signal:', error.name, error.message);
                      } else {
                        // Disconnect session
                        session.disconnect();
                      }
                    });
                    }
                });
              },
              (err) => {
                console.error(err);
              }
            );

          });

        });
      }
    });
  }

  onViewProfile(patientid: number): void {
    this.viewUserId = patientid;
  }

  onStatusChange($event: any): void {
    this.status = $event;
    this.getAppointments(true);
  }
  onDateRangeChange($event: any): void {
    this.start = $event.start;
    this.end = $event.end;
    this.getAppointments(true);
  }

  getAppointments(isReset: boolean): void {
    this.isProcessing = true;
    if (isReset) {
      this.appointments = [];
    }
    let order = (this.status === 'UpComing' ? false : true);
    const request: IAppointmentGetRequest = {
      fromDate: formatDate(this.start, DateUltil.FORMAT_SHORT_DATE, DateUltil.LOCALE),
      toDate: formatDate(this.end, DateUltil.FORMAT_SHORT_DATE, DateUltil.LOCALE),
      skip: isReset ? 0 : this.appointments.length,
      take: this.take,
      appointmentStatus: this.status,
      patientName: this.filterAppointment,
      orderDesc: order
    };
    this._videoService.getAppointments(request).subscribe(
      (response: IScrollResponse<IAppointmentInfo>) => {
        this.hasMore = response.hasMore;
        this.appointments = this.appointments.concat(response.items);
        this.isProcessing = false;
        this.hasData = this.appointments.length > 0;
      }
    );
  }

  onScroll(): any {
    if (this.hasMore && !this.isProcessing) {
      this.getAppointments(false);
    }
  }

  onCancelAppointment(appointmentId: number): any {
    this._videoService.cancelAppointment(appointmentId).subscribe(
      () => {
        this.getAppointments(true);
      }
    );
  }

  filterAppt(event: any) {
      this.filterAppointment = event;
      this.getAppointments(true);
  }
}
