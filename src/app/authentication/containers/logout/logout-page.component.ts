import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/auth.service';
import { Router } from '@angular/router';
import {ChatShareService} from '@core/services/chat-share.service';

@Component({
  template: ''
})
export class LogoutPageContainerComponent implements OnInit {
    constructor(
      private authService: AuthService,
      private router: Router,
      private chatSharedService: ChatShareService
    ) {}

    ngOnInit(): void {
      this.chatSharedService.clearChannel();
      this.authService.logout();
      this.router.navigate(['/login']);
    }
}
