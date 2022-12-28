import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DoctorApiService } from '@app/core/services/api/doctor-api.service';
import { EazyscriptAuthToken, EazyscriptPresecriptionParams } from '@app/models/interfaces/doctor.interface';

@Component({
  selector: 'app-prescription-dialog',
  templateUrl: './prescription-dialog.component.html',
  styleUrls: ['./prescription-dialog.component.scss']
})
export class PrescriptionDialogComponent implements OnInit {

  url: string;
  urlSafe: SafeResourceUrl;
  isVerifyingIDMe: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PrescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EazyscriptPresecriptionParams,
    public sanitizer: DomSanitizer,
    private _doctorService: DoctorApiService
  ) { 
    //this.url = `https://${data.doctorAuthToken.subDomain}.eazyscripts.com/Api/Public/V3/abc/Browser/New-Prescription?ApplicationKey=${data.doctorAuthToken.applicationKey}&ApplicationSecret=${data.doctorAuthToken.applicationSecret}&Token=${data.doctorAuthToken.token}&PatientId=${data.patientId}&RedirectUrl=/#&Notes='PRESCRIPTION - Testing'`;
    let subDomain = data.doctorAuthToken.subDomain;
    let applicationKey = data.doctorAuthToken.applicationKey;
    let token = data.doctorAuthToken.token;
    let eazyscriptPatientId = data.eazyscriptPatientId;

    if(data.doctorAuthToken.isVerifiedIDMe) {
      // Add new prescription
      //let redirectUrl = 'https://mddevweb.move78.com/callback';
      let redirectUrl = '/';
      this.url = `https://${subDomain}.eazyscripts.com/Api/Public/V3/${subDomain}/Browser/New-Prescription?ApplicationKey=${applicationKey}&Token=${token}&PatientId=${eazyscriptPatientId}&RedirectUrl=${redirectUrl}&Notes=`;
    }
    else {
      // Verify ID.Me
      this.isVerifyingIDMe = true;
      this.url = `https://${subDomain}.eazyscripts.com/Api/Public/V3/${subDomain}/Browser/auto-login?ez_redirectUrl=/app/my-account/prescriber&ApplicationKey=${applicationKey}&Token=${token}`;
    }

    // Test
    console.log(this.url);

    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    // Callback
    // Check and update ID.Me verification
    dialogRef.afterClosed().subscribe(result => {
      if(this.isVerifyingIDMe) {
        this._doctorService.checkAndUpdateIDMe().subscribe(result => {
          console.log(`ID.Me verification result : ${result}`);
        });
      }
    });

  }

  ngOnInit(): void {
  }

}
