import { Component, Inject, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoctorService } from '@app/core/services/doctor.service';
import { NotificationService } from '@app/core/services/notification.service';
import { IPopupInfo } from '@app/models/interfaces/common.interface';
import { ChangePassword } from '@app/models/interfaces/doctor.interface';
import { MyErrorStateMatcher } from '@core/validators/custom-validators';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: 'change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordDialogComponent {
  public onDialogSubmit = new EventEmitter();
  @ViewChild('editForm') editForm: FormGroupDirective;
  passwordForm: FormGroup;
  isHasError: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPopupInfo,
    private _notificationService: NotificationService,
    private _doctorService: DoctorService,
  ) {
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [
        Validators.required,
      ]),
      newPassword: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    this.hasFormInvalid();
    if (!this.isHasError) {
      const changePassData: ChangePassword = {
        oldPassword: this.f.oldPassword.value,
        newPassword: this.f.newPassword.value
      };

      this._doctorService.changePassword(changePassData).subscribe(response => {
        this.dialogRef.close();
        this.editForm.resetForm()
        this._notificationService.success('Password successfully changed!');
      }, error => {
        let { message } = error;
        this.dialogRef.close();
        this._notificationService.error(message);
      });
    }
  }

  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  get f(): any {
    return this.passwordForm.controls;
  }

  hasFormInvalid() {
    this.isHasError = this.passwordForm.invalid;
  }
}
