import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponentModule } from './components/admin-component.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ChatComponent } from './containers/chat/chat.component';
import { AppointmentComponent } from './containers/appointment/appointment.component';
import { VideoChatComponent } from './containers/video-chat/video-chat/video-chat.component';
import { SchedulerComponent } from './containers/scheduler/scheduler.component';
import { DxDataGridModule, DxSchedulerModule } from 'devextreme-angular';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
import { DoctorSettingsComponent } from './containers/doctor-settings/doctor-settings.component';
import { PasswordUpdateComponent } from './components/password-update/password-update.component';
import { DoctorPrescriptionHistoryComponent } from './containers/doctor-prescription-history/doctor-prescription-history.component';

@NgModule({
  declarations: [
    ChatComponent,
    AppointmentComponent,
    VideoChatComponent,
    SchedulerComponent,
    DoctorProfileComponent,
    PasswordUpdateComponent,
    DoctorSettingsComponent,
    DoctorPrescriptionHistoryComponent,
  ],
  imports: [
    AdminComponentModule,
    SharedModule,
    AdminRoutingModule,
    CommonModule,
    DxDataGridModule, 
    DxSchedulerModule, 
  ],
  providers: []
})
export class AdminModule {}
