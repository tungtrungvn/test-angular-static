import { Component, Input } from '@angular/core';
import { IPatientInfo } from '@app/models/interfaces/users.interface';

@Component({
  selector: 'app-patient-general-info',
  templateUrl: './patient-general-info.component.html',
  styleUrls: ['./patient-general-info.component.scss']
})
export class PatientGeneralInfoComponent {
  @Input() patientInfo: IPatientInfo | undefined;
}
