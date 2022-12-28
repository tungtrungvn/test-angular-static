import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-forgot-password-s4',
  templateUrl: './forgot-password-s4.component.html',
  styleUrls: ['./forgot-password-s4.component.scss']
})
export class ForgotPasswordStep4Component implements OnInit {
  @Output() login: EventEmitter<any> = new EventEmitter();
  @Input() email: string = '';

  public submitted = false;

  constructor() { }

  ngOnInit(): void {
  }

  resend() {
  }
}
