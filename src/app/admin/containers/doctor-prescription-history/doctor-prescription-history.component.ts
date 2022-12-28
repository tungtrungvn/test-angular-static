import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActionConfirmDialogComponent } from '@app/admin/components/dialogs/action-confirm/action-confirm.component';
import { DoctorApiService } from '@app/core/services/api/doctor-api.service';
import { AuthService } from '@app/core/services/auth.service';
import { IPopupInfo } from '@app/models/interfaces/common.interface';
import { EazyscriptAuthToken, EazyscriptPresecriptionParams } from '@app/models/interfaces/doctor.interface';
import { IPatientInfo } from '@app/models/interfaces/users.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doctor-prescription-history',
  templateUrl: './doctor-prescription-history.component.html',
  styleUrls: ['./doctor-prescription-history.component.scss']
})
export class DoctorPrescriptionHistoryComponent implements OnInit, OnDestroy {

  @Input() patientInfo: IPatientInfo | undefined;
  url: string;
  urlSafe: SafeResourceUrl;
  subscriptions: Subscription[] = [];
  eazyscriptData: EazyscriptPresecriptionParams;
  
  constructor(public sanitizer: DomSanitizer,
    private _doctorService: DoctorApiService,
    private _dialog: MatDialog,
    private _authService: AuthService) { 
      this.getEazyscriptAuthenData();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
   });
  }

  getEazyscriptAuthenData()  {
    if(!this._authService.getUser().eazyScriptId) {
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
    }
    else {
      let eazyScriptAuthSub =  this._doctorService.getEazyscriptAuthToken().subscribe((authData: EazyscriptAuthToken) => {
        this.eazyscriptData = {
          eazyscriptPatientId: this.patientInfo?.eazyscriptId,
          doctorAuthToken: authData
        };
        let subDomain = this.eazyscriptData.doctorAuthToken.subDomain;
        let applicationKey = this.eazyscriptData.doctorAuthToken.applicationKey;
        let doctorToken = this.eazyscriptData.doctorAuthToken.token;
        this.url = `https://${subDomain}.eazyscripts.com/Api/Public/V3/${subDomain}/Browser/auto-login?ez_redirectUrl=/app/dashboard&ApplicationKey=${applicationKey}&Token=${doctorToken}&hideLeftMenu=false&hideTopMenu=false&menus=`;
  
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  
      });
  
      this.subscriptions.push(eazyScriptAuthSub);
    }
  }

}
