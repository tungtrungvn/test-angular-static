import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CdkTableModule } from '@angular/cdk/table';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AppHeaderComponent } from './layouts/admin/header/header.component';
import { AppSidebarComponent } from './layouts/admin/sidebar/sidebar.component';
import { SharedModule } from '@shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { AuthComponent } from './authentication/authentication.component';
import { Page404Component } from './public/404/404-page.component';
import { CompleteAccountPageContainerComponent } from './public/complete-account/complete-account-page.component';

import { DxDataGridModule, DxSchedulerModule } from 'devextreme-angular';
import {ResponsiveDetected} from '@core/utils/responsive-detected.util';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    SpinnerComponent,
    AuthComponent,
    Page404Component,
    CompleteAccountPageContainerComponent
  ],
  imports: [
    DxDataGridModule,
    DxSchedulerModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthenticationModule,
    CdkTableModule,
    A11yModule,
    BidiModule,
    CdkAccordionModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    RouterModule.forRoot(AppRoutingModule, {useHash: false})
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    ResponsiveDetected
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor() {
    Date.prototype.toJSON = function (): string {
      const timezoneOffsetInHours = -(this.getTimezoneOffset() / 60);
      const sign = timezoneOffsetInHours >= 0 ? '+' : '-';
      const leadingZero = (Math.abs(timezoneOffsetInHours) < 10) ? '0' : '';
      const correctedDate = new Date(this.getFullYear(), this.getMonth(),
        this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(),
        this.getMilliseconds());
      correctedDate.setHours(this.getHours() + timezoneOffsetInHours);
      const iso = correctedDate.toISOString().replace('Z', '');

      return iso + sign + leadingZero + Math.abs(timezoneOffsetInHours).toString() + ':00';
    };
  }
}
