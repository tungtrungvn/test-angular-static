import { Injectable } from '@angular/core';
import { AuthApiService } from './api/auth-api.service';
import { Observable } from 'rxjs';
import { ILoginBody, ILogin, ILoginFirebaseBody, IUserFirebase } from '@interfaces/auth.interface';
import { Ability, AbilityBuilder } from '@casl/ability';
import { IUserInfo } from '@app/models/interfaces/users.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private authApiService: AuthApiService,
        private ability: Ability,
    ) { }

    clearToken(): void {
        localStorage.clear();
    }
    setUser(user: IUserInfo): void {
        localStorage.setItem('userInfo', JSON.stringify(user));
    }
    getUser(): IUserInfo {
        let userJson: string;
        userJson = localStorage.getItem('userInfo') || '';
        const user = userJson ? JSON.parse(userJson) : undefined;
        return user;
    }
    setToken(token: string): void {
        localStorage.setItem('token', JSON.stringify(token));
    }
    getToken(): string {
        let token: string;
        token = localStorage.getItem('token') || '';
        return token ? JSON.parse(token) : '';
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        } else {
            return true;
        }
    }

    login(data: ILoginBody): Observable<ILogin> {
        return this.authApiService.loginApi(data);
    }

    logout(): void {
        this.ability.update([]);
        localStorage.clear();
    }

    requestForgotPassword(data: any): Observable<any> {
        return this.authApiService.requestForgotPassword(data);
    }

    checkRequestPassword(code: string): Observable<any> {
        return this.authApiService.checkRequestPassword(code);
    }

    updateNewPassword(data: any): Observable<any> {
        return this.authApiService.updateNewPassword(data);
    }
}
