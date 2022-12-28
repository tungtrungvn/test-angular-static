import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password-s1',
  templateUrl: './forgot-password-s1.component.html',
  styleUrls: ['./forgot-password-s1.component.scss']
})
export class ForgotPasswordStep1Component implements OnInit {
  @Output() requestResetPassword: EventEmitter<string> = new EventEmitter();
  isHasInvalid: boolean = false;

  public forgotPasswordForm = new FormGroup({
    email: new FormControl('',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/),
        Validators.email,
      ]),
    ),
  });

  public submitted = false;

  constructor() { }

  ngOnInit(): void {
  }

  get f(): any {
    return this.forgotPasswordForm.controls;
  }

  onSubmit(): void {
    this.hasFormInvalid();
    if (!this.isHasInvalid) {
      this.requestResetPassword.emit(this.f.email.value);
    }
  }

  hasFormInvalid() {
    this.isHasInvalid = this.forgotPasswordForm.invalid;
  }
}
