import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorDialogComponent } from '@app/admin/components/dialogs/error/error.component';
import { NotificationService } from '@app/core/services/notification.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageContainerComponent implements OnInit {
  public message: any;
  public userToken: any;
  public step: number = 1;
  email: string = '';
  code: string = '';
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) {
    this.message = {
      message: '',
      type: ''
    };
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params && params.code) {
          this.code = params.code;
          this.step = 3;
          this.checkCodeRequestPassword();
        }
      });
  }

  requestResetPassword(event: string) {
    this.email = event;
    this.authService.requestForgotPassword({ Email: this.email }).subscribe(response => {
      this.step = 2;
    });
  }

  resendForgotPassword(event: string) {
    this.email = event;
    this.authService.requestForgotPassword({ Email: this.email }).subscribe(response => {
      this.step = 2;
    });
  }

  checkCodeRequestPassword() {
    this.authService.checkRequestPassword(this.code).subscribe(response => {
      if (response) {
        this.step = 3;
      } else {
        this.errorMessage();
      }
    }, error => {
      this.errorMessage();
    });
  }

  resetPassword(event: any) {
    console.log(event);
    const data = {
      Code: this.code,
      NewPassword: event.newPassword
    }
    this.authService.updateNewPassword(data).subscribe(response => {
      this.step = 4;
    }, error => {
      this.notificationService.error('Update new password fail');
    });
  }

  errorMessage() {
    const dialogRef = this.dialog.open(
      ErrorDialogComponent,
      {
        panelClass: 'custom-dialog',
        width: '400px',
        data: 'The password reset link has expired!'
      }
    );
    dialogRef.componentInstance.onDialogSubmit.subscribe(() => {
      this.step = 1;
    });
  }
}
