import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DoctorApiService } from '@app/core/services/api/doctor-api.service';
import { IPatientInfo } from '@app/models/interfaces/users.interface';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnChanges {
  @Input() patientId: number | undefined;
  @Input() firebaseUserId: string;
  @Output() hideProfile: EventEmitter<any> = new EventEmitter();
  @Output() getPatientProfile: EventEmitter<any> = new EventEmitter();
  patientInfo: IPatientInfo | undefined;
  public noAvatar = 'assets/images/users/no-avatar.png';
  constructor(private _doctorService: DoctorApiService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.patientId) {
      this.getPatientInfo();
    }
  }
  onHideProfile(): void {
    this.hideProfile.emit();
  }

  getPatientInfo() {
    if (!this.patientId) {
      return;
    }
    this._doctorService.getPatientInfo(this.patientId).subscribe(
      (response: IPatientInfo) => {
        this.patientInfo = response;
        this.getPatientProfile.emit(response);
      }
    );
  }
}
