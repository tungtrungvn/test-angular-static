import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginPageContainerComponent } from './containers/login/login-page.component';
import { LoginFormComponent } from './components/login/form/login-form.component';
import { LogoutPageContainerComponent } from './containers/logout/logout-page.component';
import { ForgotPasswordStep1Component } from './components/forgot-password/step1/forgot-password-s1.component';
import { ForgotPasswordStep2Component } from './components/forgot-password/step2/forgot-password-s2.component';
import { ForgotPasswordStep3Component } from './components/forgot-password/step3/forgot-password-s3.component';
import { ForgotPasswordStep4Component } from './components/forgot-password/step4/forgot-password-s4.component';
import { ForgotPasswordPageContainerComponent } from './containers/forgot-password/forgot-password-page.component';
import { CallbackComponent } from './containers/callback/callback.component';

@NgModule({
  declarations: [
    LoginPageContainerComponent,
    LogoutPageContainerComponent,
    LoginFormComponent,
    ForgotPasswordStep1Component,
    ForgotPasswordStep2Component,
    ForgotPasswordStep3Component,
    ForgotPasswordStep4Component,
    ForgotPasswordPageContainerComponent,
    CallbackComponent
  ],
  imports: [
    SharedModule,
    AuthenticationRoutingModule,
  ],
})
export class AuthenticationModule { }
