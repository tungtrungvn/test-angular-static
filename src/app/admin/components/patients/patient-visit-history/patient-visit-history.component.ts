import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/core/services/notification.service';
import { VideoService } from '@app/core/services/video.service';
import { IPatientInfo } from '@app/models/interfaces/users.interface';
import { SoapNote, VisitHistory } from '@app/models/interfaces/videocall.interface';
import { SoapDialogComponent } from '../../dialogs/soap-dialog/soap-dialog.component';

@Component({
  selector: 'app-patient-visit-history',
  templateUrl: './patient-visit-history.component.html',
  styleUrls: ['./patient-visit-history.component.scss']
})
export class PatientVisitHistoryComponent{
  @Input() visitHistories: VisitHistory[] = [];
  @Input() patientInfo: IPatientInfo | undefined;
  
  constructor(private _dialog: MatDialog,
    private _notificationService: NotificationService,
    private _videoService: VideoService) { 
    }
    
  onOpenSoapPopup(appointmentId: number): void {
    if (!this.patientInfo) {
      return;
    }

    this._videoService.getAppointmentSoapNote(appointmentId).subscribe(
      (response: SoapNote) => {
        const popupInfo: any = {
          patientInfo: this.patientInfo,
          soapNote: response
        };
        const dialogRef = this._dialog.open(
          SoapDialogComponent,
          {
            panelClass: 'custom-dialog',
            width: '800px',
            data: popupInfo
          }
        );
        dialogRef.componentInstance.onDialogSubmit.subscribe((soap: SoapNote) => {
          soap.appointmentId = appointmentId;
          this._videoService.upsertAppointmentSoapNote(soap).subscribe(
            () => {
              //Not need process response
            },
            error => {
              const { message } = error;
              this._notificationService.error(message);
            },
          );
        });
      }
    );

    
    
  }
}
