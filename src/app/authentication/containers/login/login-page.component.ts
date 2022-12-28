import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILogin, ILoginBody } from '@interfaces/auth.interface';
import { AuthService } from '@core/services/auth.service';
import jwt_decode from 'jwt-decode';
import { Subject } from 'rxjs';
import { IUserInfo } from '@app/models/interfaces/users.interface';
import { DoctorService } from '@app/core/services/doctor.service';
import { DataShareService } from '@app/core/services/data-share.service';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageContainerComponent implements OnInit {

  private destroy$ = new Subject();
  public message: any;
  public userToken: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private doctorService: DoctorService,
    private dataShareService: DataShareService,
    private router: Router,
  ) {
    this.message = {
      message: '',
      type: ''
    };
  }

  ngOnInit(): void {
    this.authService.logout();
    this.activatedRoute.queryParams.subscribe(params => {
      const state = params.state;
      if (state === 'reset-password-succeed') {
        this.message = {
          message: `Awesome, you've successfully updated your password.`,
          type: 'success'
        };
      }
    });

    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  public onLogin(data: ILoginBody): void {
    this.authService.login(data).subscribe(
      async (response: ILogin) => {
        const { token } = response;
        this.authService.setToken(token);
        this.getSpecialties(jwt_decode(token));
      },
      error => {
        const { message } = error;
        this.message = {
          message,
          type: 'error'
        };
      },
    );
  }

  getSpecialties(userToken: any) {
    this.doctorService.getSpecialties().subscribe(response => {
      const user: IUserInfo = {
        id: parseInt(userToken.user_id),
        avatarUrl: userToken.avatar,
        email: userToken.email,
        firstName: userToken.user_first_name,
        lastName: userToken.user_last_name,
        gender: parseInt(userToken.gender),
        phone: userToken.phone_number,
        birthday: userToken.birthday,
        specialty: response.find((splt: any) => splt.value === Number(userToken.specialty))?.text || '',
        address: userToken.business_address,
        eazyScriptId: userToken.eazyscript_account_id
      };
      this.dataShareService.updateDoctorInfo(user);
      this.authService.setUser(user);
      this.router.navigate(['/']);
    })
  }
}
