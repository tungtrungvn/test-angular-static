import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DoctorApiService } from '@app/core/services/api/doctor-api.service';
import { EazyscriptAuthToken, EazyscriptPresecriptionParams } from '@app/models/interfaces/doctor.interface';
import { IPatientInfo } from '@app/models/interfaces/users.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-medication-history',
  templateUrl: './patient-medication-history.component.html',
  styleUrls: ['./patient-medication-history.component.scss']
})
export class PatientMedicationHistoryComponent implements OnInit, OnDestroy {

  @Input() patientInfo: IPatientInfo | undefined;
  url: string;
  urlSafe: SafeResourceUrl;
  subscriptions: Subscription[] = [];
  eazyscriptData: EazyscriptPresecriptionParams;
  
  constructor(public sanitizer: DomSanitizer,
    private _doctorService: DoctorApiService) {
        this.getEazyscriptAuthenData();
  }

  ngOnInit(): void {
    //this.getEazyscriptAuthenData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
   });
  }
  
  getEazyscriptAuthenData()  {
    let eazyScriptAuthSub =  this._doctorService.getEazyscriptAuthToken().subscribe((authData: EazyscriptAuthToken) => {
      this.eazyscriptData = {
        eazyscriptPatientId: this.patientInfo?.eazyscriptId,
        doctorAuthToken: authData
      };

      if(this.eazyscriptData.eazyscriptPatientId) {
        this.url = `https://${this.eazyscriptData.doctorAuthToken.subDomain}.eazyscripts.com/Api/Public/V3/demo-move78/Browser/auto-login?ez_redirectUrl=/app/patients/${this.eazyscriptData.eazyscriptPatientId}/med-history&ApplicationKey=${this.eazyscriptData.doctorAuthToken.applicationKey}&&Token=${this.eazyscriptData.doctorAuthToken.token}&hideLeftMenu=true&hideTopMenu=false`;
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      }

    });

    this.subscriptions.push(eazyScriptAuthSub);
  }


}
