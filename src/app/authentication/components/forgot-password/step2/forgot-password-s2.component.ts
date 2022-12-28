import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-forgot-password-s2',
  templateUrl: './forgot-password-s2.component.html',
  styleUrls: ['./forgot-password-s2.component.scss']
})
export class ForgotPasswordStep2Component implements OnInit {
  @Output() resendForgotPassword: EventEmitter<string> = new EventEmitter();
  @Input() email: string = '';
  timer: number = 60;
  display: any;
  interval: any;
  disabled = true;

  constructor() { }

  ngOnInit(): void {
    this.setTimer();
  }

  resend() {
    if (!this.disabled) {
      this.setTimer();
      this.resendForgotPassword.emit(this.email);
    }
  }

  setTimer() {
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.display = this.transform(this.timer);
      } else {
        this.timer = 120;
        this.disabled = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return `0${minutes}:${(value - minutes * 60) < 10 ? '0' + (value - minutes * 60) : (value - minutes * 60)}`;
  }
}
