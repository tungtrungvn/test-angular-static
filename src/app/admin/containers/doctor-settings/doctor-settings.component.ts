import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DoctorProfileComponent } from '@app/admin/components/doctor-profile/doctor-profile.component';
import { AuthService } from '@app/core/services/auth.service';
import { DataShareService } from '@app/core/services/data-share.service';
import { DoctorService } from '@app/core/services/doctor.service';
import { NotificationService } from '@app/core/services/notification.service';
import { StateService } from '@app/core/services/state.service';
import { IFileResponse } from '@app/models/interfaces/file.interface';
import { IUserInfo } from '@app/models/interfaces/users.interface';

@Component({
  selector: 'app-doctor-settings',
  templateUrl: './doctor-settings.component.html',
  styleUrls: ['./doctor-settings.component.scss']
})
export class DoctorSettingsComponent implements OnInit, OnDestroy {
  @ViewChild(DoctorProfileComponent) doctorProfile: DoctorProfileComponent;

  newAvatar: any;
  constructor(private stateService: StateService,
    private authService: AuthService,
    private doctorService: DoctorService,
    private dataShareService: DataShareService,
    private notificationService: NotificationService,) {
  }

  ngOnInit(): void {
    this.stateService.headerInWhite.next(false);
  }

  ngOnDestroy() {
    this.stateService.headerInWhite.next(false);
  }

  updateProfile(data: any) {
    this.doctorService.updateDoctorProfile(data.profile).subscribe(response => {
      this.authService.setUser({ ...data.profile, specialty: data.specialty });
      this.dataShareService.updateDoctorInfo({
        ...data.profile,
        specialty: data.specialty,
        avatarUrl: data.profile?.avatar
      });
      this.notificationService.success('Doctor details successfully updated!');
    }, error => {
      this.notificationService.error(error?.message || 'Update Profile Failed');
    })
  }

  uploadAvatar(file: File) {
    this.doctorService.changeAvatar(file).subscribe((response: any) => {
      this.dataShareService.updateDoctorInfo({
        avatarUrl: response.avatarUrl
      });
      this.notificationService.success('Doctor avatar successfully updated');
    }, error => {
      this.notificationService.error(error?.message || 'Change Avatar Failed');
      this.newAvatar = '';
    });
  }
}
