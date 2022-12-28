import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DoctorService } from '@app/core/services/doctor.service';
import { ChangePassword } from '@app/models/interfaces/doctor.interface';


@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.scss']
})
export class PasswordUpdateComponent implements OnInit {
  passwordForm: FormGroup;
  changePassword: boolean = false;
  @Output() onPreUpdate = new EventEmitter();
  @Output() onPostUpdate = new EventEmitter();
  @Output() onCancelUpdate = new EventEmitter();
  message: string;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  success: boolean = false;

  constructor(private _doctorService: DoctorService) { }

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl(),
      newPassword: new FormControl(),
    });    
  }

  changeMode() {
    this.changePassword = !this.changePassword;
    this.onPreUpdate.emit();
  }

  cancelUpdate() {
    this.changePassword = !this.changePassword;
    this.onCancelUpdate.emit();
  }

  submit() {
    let changePassData: ChangePassword = {
      oldPassword: this.passwordForm.get('oldPassword')?.value as string,
      newPassword: this.passwordForm.get('newPassword')?.value as string
    };

    this._doctorService.changePassword(changePassData).subscribe(response => {
      this.changePassword = !this.changePassword;
      this.message = "";
      this.success = true;
      this.onPostUpdate.emit();
    }, error => {
      let {message} = error;
      this.message = message;
    });
  }

  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

}
