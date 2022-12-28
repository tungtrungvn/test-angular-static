import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';

import { EncodeHttpParamsInterceptor } from '@core/interceptors/encodeHttpParams.interceptor';
import { ResponseInterceptor } from '@core/interceptors/responses.interceptor';
import { TokenInterceptor } from '@core/interceptors/token.interceptor';
import { AuthGuard } from '@core/guards/auth.guard';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { MaterialModule } from '@app/material-module';
import { MomentDatePipe } from '@core/pipe/momentDate.pipe';
import { DateSuffix } from '@core/pipe/dateSuffix.pipe';
import { NumberUnreadPipe } from '@core/pipe/number-unread.pipe';
import { BirthdatePipe } from '@app/core/pipe/birthday.pipe';
import { HeightPipe } from '@app/core/pipe/height.pipe';
import { SpaceAfterCommaPipe } from '@core/pipe/spaceAfterComma.pipe';
import { MomentLocalDatePipe } from '@core/pipe/momentDate.local.pipe';
import { MomentLocalDateTimePipe } from '@core/pipe/momentDateTime.local.pipe';
import { SavingPlanPipe } from '@core/pipe/savingPlan.pipe';
import { SafePipe } from '@core/pipe/safe.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import {AutosizeModule} from 'ngx-autosize';
import {LightgalleryModule} from 'lightgallery/angular';
import {NgChartsModule} from 'ng2-charts';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    MomentDatePipe,
    MomentLocalDatePipe,
    MomentLocalDateTimePipe,
    SavingPlanPipe,
    DateSuffix,
    NumberUnreadPipe,
    BirthdatePipe,
    HeightPipe,
    SpaceAfterCommaPipe,
    SafePipe,
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    AbilityModule,
    FormsModule,
    NgxDropzoneModule,
    NgbModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    AutosizeModule,
    LightgalleryModule,
    NgChartsModule
  ],
  exports: [
    HttpClientModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AbilityModule,
    FlexLayoutModule,
    MomentDatePipe,
    MomentLocalDatePipe,
    MomentLocalDateTimePipe,
    SavingPlanPipe,
    DateSuffix,
    NumberUnreadPipe,
    BirthdatePipe,
    HeightPipe,
    SpaceAfterCommaPipe,
    NgxDropzoneModule,
    SafePipe,
    NgbModule,
    MaterialModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    AutosizeModule,
    LightgalleryModule,
    NgChartsModule
  ],
  providers: [
    MomentDatePipe,
    MomentLocalDatePipe,
    MomentLocalDateTimePipe,
    SavingPlanPipe,
    SafePipe,
    DatePipe,
    MenuItems,
    AuthGuard,
    { provide: Ability, useValue: new Ability() },
    { provide: PureAbility, useExisting: Ability },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EncodeHttpParamsInterceptor,
      multi: true
    }
  ]
})
export class SharedModule { }
