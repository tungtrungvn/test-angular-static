import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DoctorApiService } from '@app/core/services/api/doctor-api.service';
import { VideoService } from '@app/core/services/video.service';
import { IPopupInfo } from '@app/models/interfaces/common.interface';
import { EazyscriptAuthToken, EazyscriptPresecriptionParams } from '@app/models/interfaces/doctor.interface';
import { IPatientInfo } from '@app/models/interfaces/users.interface';
import { VisitHistory } from '@app/models/interfaces/videocall.interface';
import { IVitalSignResponse } from '@app/models/interfaces/vital.interface';
import { Subscription } from 'rxjs';
import { ActionConfirmDialogComponent } from '../../dialogs/action-confirm/action-confirm.component';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit {
  @Input() userId: number;
  patientInfo: IPatientInfo | undefined;
  eazyscriptData: EazyscriptPresecriptionParams;
  noAvatar = 'assets/images/users/no-avatar.png';
  vitals: IVitalSignResponse[] = [];
  visitHistories: VisitHistory[] = [];
  subscriptions: Subscription[] = [];

  constructor(private _doctorService: DoctorApiService,
    private _videoService: VideoService,
    private _dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.getPatientInfo();
    this.getVitals();
    this.getVisitHistories();
  }
  
  /*ngOnChanges(changes: SimpleChanges): void {
    if (changes.userId) {
      this.getPatientInfo();
      this.getVitals();
      this.getVisitHistories();
    }
  }*/

  /*ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
   });
  }*/

  getPatientInfo() {
    if (!this.userId) {
      return;
    }
    this._doctorService.getPatientInfo(this.userId).subscribe(
      (response: IPatientInfo) => {
        this.patientInfo = response;
      }
    );
  }

  getVisitHistories() {
    if (!this.userId) {
      return;
    }
    this._videoService.getVisitHistories(this.userId).subscribe(
      (response: VisitHistory[]) => {
        this.visitHistories = response;
      }
    );
  }

  getVitals() {
    if (!this.userId) {
      return;
    }
    this._doctorService.getVitals(this.userId).subscribe(
      (response: IVitalSignResponse[]) => {
        this.vitals = response;
      }
    );
  }

  getVitalDetail(code: string): IVitalSignResponse|undefined {
    if (!this.vitals || !this.vitals.length) {
      return undefined;
    }
    
    const vital = this.vitals.filter(function (item) { return item.code === code; })[0];
    if (vital && code === '85354-9') {
      const systolic = vital.components?.filter(function (item) { return item.code ===  '8480-6'; })[0];
      const diastolic = vital.components?.filter(function (item) { return item.code ===  '8462-4'; })[0];
      vital.uom = systolic?.uom;
      vital.valueToStr = `${systolic?.value}/${diastolic?.value}`;
    }
    return vital;
  }

  onMedicationHistoryClick($event: any) {
    if($event.index == 4 && !this.patientInfo?.eazyscriptId) {
      const popupInfo: IPopupInfo = {
        btnCancelText: 'Close',
        btnOkText: '',
        content: "This patient doesn't have an Eazyscript account.",
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
    }
  }

}
