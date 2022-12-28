import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { ChatComponent } from './containers/chat/chat.component';
import { AppointmentComponent } from './containers/appointment/appointment.component';
import { VideoChatComponent } from './containers/video-chat/video-chat/video-chat.component';
import { SchedulerComponent } from './containers/scheduler/scheduler.component';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
import { DoctorSettingsComponent } from './containers/doctor-settings/doctor-settings.component';
import { DoctorPrescriptionHistoryComponent } from './containers/doctor-prescription-history/doctor-prescription-history.component';
const routes: Routes = [
  { path: '', redirectTo: 'appointment', pathMatch: 'full' },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'appointment',
    component: AppointmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'video-chat',
    component: VideoChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'scheduler',
    component: SchedulerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: DoctorSettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'prescription-history',
    component: DoctorPrescriptionHistoryComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
