import { Injectable } from '@angular/core';
import { ILoginBody, ILogin, ILoginFirebaseBody } from '@interfaces/auth.interface';
import { Observable } from 'rxjs';
import { IUserInfo } from '@interfaces/users.interface';
import { ApiService } from './api.service';
import { environment as env } from '@env/environment';
const FIREBASE_URL = env.apiFireBaseUrl;
const firebaseKey = env.FIREBASE_API_KEY;
const routes = {
  login: '/doctor/login',
  loginFirebase:'/v1/accounts:signInWithPassword?key='+firebaseKey,
  getByTokenUrl: (token: string) => `/auths/get-by-token?token=${token}`,
  updateUserInviteUrl: '/auths/update-user-invite',
  getUserInfoUrl: '/account',
  forgotPassword: '/doctor/request-forgot-password',
  checkRequestPassword: (code: string) => `/doctor/check-request-password?code=${code}`,
  updateNewPassword: '/doctor/update-new-password',
};

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private apiService: ApiService) { }
  //add longdvk
  loginFirebaseApi(data: ILoginFirebaseBody): Observable<any> {
    return this.apiService.postFullPath(FIREBASE_URL+routes.loginFirebase, data);
  }
  loginApi(data: ILoginBody): Observable<ILogin> {
    return this.apiService.post(routes.login, data);
  }

  getByToken(token: string): Observable<IUserInfo> {
    return this.apiService.get(routes.getByTokenUrl(token));
  }
  updateUserInfoApi(params: any): Observable<any> {
    return this.apiService.put(routes.updateUserInviteUrl, params);
  }
  requestForgotPassword(data: any): Observable<ILogin> {
    return this.apiService.post(routes.forgotPassword, data);
  }
  checkRequestPassword(code: string): Observable<ILogin> {
    return this.apiService.get(routes.checkRequestPassword(code));
  }
  updateNewPassword(data: any): Observable<ILogin> {
    return this.apiService.post(routes.updateNewPassword, data);
  }
}
