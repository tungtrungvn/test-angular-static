import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageContainerComponent } from './containers/login/login-page.component';
import { LogoutPageContainerComponent } from './containers/logout/logout-page.component';
import { ForgotPasswordPageContainerComponent } from './containers/forgot-password/forgot-password-page.component';
import { CallbackComponent } from './containers/callback/callback.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageContainerComponent
  },
  {
    path: 'logout',
    component: LogoutPageContainerComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageContainerComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
