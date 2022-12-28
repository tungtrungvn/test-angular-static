import { Component, Input } from '@angular/core';
import { IPatientInfo } from '@app/models/interfaces/users.interface';

@Component({
  selector: 'app-patient-insurance-info',
  templateUrl: './patient-insurance-info.component.html',
  styleUrls: ['./patient-insurance-info.component.scss']
})
export class PatientInsuranceInfoComponent {
  @Input() patientInfo: IPatientInfo | undefined;
}
