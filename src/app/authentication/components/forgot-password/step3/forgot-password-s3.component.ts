import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password-s3',
  templateUrl: './forgot-password-s3.component.html',
  styleUrls: ['./forgot-password-s3.component.scss']
})
export class ForgotPasswordStep3Component implements OnInit {
  @Output() resetPassword: EventEmitter<string> = new EventEmitter();
  doctorId: string = '';
  passwordForm: FormGroup;
  isHasError: boolean = false;
  isMatchingPassword: boolean = true;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  public submitted = false;

  constructor() {
    this.passwordForm = new FormGroup({
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {
  }

  submit() {
    this.hasFormInvalid();
    this.isMatchingPassword = this.f.newPassword.value === this.f.confirmPassword.value;
    if (!this.isHasError && this.isMatchingPassword) {
      this.resetPassword.emit(this.passwordForm.value);
    }
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get f(): any {
    return this.passwordForm.controls;
  }

  hasFormInvalid() {
    this.isHasError = this.passwordForm.invalid;
  }
}
