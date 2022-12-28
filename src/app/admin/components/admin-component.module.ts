import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { ServiceCatogoriesComponent } from './common/service-catogories/service-catogories.component';
import { DoctorServiceComponent } from './common/doctor-service/doctor-service.component';
import { ChatListComponent } from './chats/chat-list/chat-list.component';
import { ChatDetailComponent } from './chats/chat-detail/chat-detail.component';
import { PatientProfileComponent } from './patients/patient-profile/patient-profile.component';
import { PatientDeviceReadingComponent } from './patients/patient-device-reading/patient-device-reading.component';
import { AppointmentFilterComponent } from './appointment/appointment-filter/appointment-filter.component';
import { AppointmentListComponent } from './appointment/appointment-list/appointment-list.component';
import { SubscriberComponent } from './video-chat/subscriber/subscriber.component';
import { PublisherComponent } from './video-chat/publisher/publisher.component';
import { ActionConfirmDialogComponent } from './dialogs/action-confirm/action-confirm.component';
import { ChangePasswordDialogComponent } from './dialogs/change-password/change-password.component';
import { PendingCallDialogComponent } from './dialogs/pending-call-dialog/pending-call-dialog.component';
import { PatientInfoComponent } from './patients/patient-info/patient-info.component';
import { PatientGeneralInfoComponent } from './patients/patient-general-info/patient-general-info.component';
import { PatientVisitHistoryComponent } from './patients/patient-visit-history/patient-visit-history.component';
import { SoapDialogComponent } from './dialogs/soap-dialog/soap-dialog.component';
import { PatientInsuranceInfoComponent } from './patients/patient-insurance-info/patient-insurance-info.component';
import { QuestionsInfoComponent } from './video-chat/questions-info/questions-info.component';
import { ConversationComponent } from './video-chat/conversation/conversation.component';
import { SoapComponent } from './video-chat/soap/soap.component';
import { PrescriptionDialogComponent } from './dialogs/prescription-dialog/prescription-dialog.component';
import { PatientMedicationHistoryComponent } from './patients/patient-medication-history/patient-medication-history.component';
import { ErrorDialogComponent } from './dialogs/error/error.component';
import { ChartsDeviceReadingComponent } from './charts-device-reading/charts-device-reading.component';
import { PatientHealthDataComponent } from './patients/patient-health-data/patient-health-data.component';

@NgModule({
  declarations: [
    ServiceCatogoriesComponent,
    DoctorServiceComponent,
    ChatListComponent,
    ChatDetailComponent,
    PatientProfileComponent,
    PatientDeviceReadingComponent,
    AppointmentFilterComponent,
    AppointmentListComponent,
    SubscriberComponent,
    PublisherComponent,
    ActionConfirmDialogComponent,
    ChangePasswordDialogComponent,
    PendingCallDialogComponent,
    PatientInfoComponent,
    PatientGeneralInfoComponent,
    PatientVisitHistoryComponent,
    SoapDialogComponent,
    PatientInsuranceInfoComponent,
    QuestionsInfoComponent,
    ConversationComponent,
    SoapComponent,
    PrescriptionDialogComponent,
    PatientMedicationHistoryComponent,
    ErrorDialogComponent,
    ChartsDeviceReadingComponent,
    PatientHealthDataComponent,
  ],
  entryComponents: [
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule
  ],
  exports: [
    ServiceCatogoriesComponent,
    DoctorServiceComponent,
    ChatListComponent,
    ChatDetailComponent,
    PatientProfileComponent,
    PatientDeviceReadingComponent,
    AppointmentFilterComponent,
    AppointmentListComponent,
    ActionConfirmDialogComponent,
    ChangePasswordDialogComponent,
    SubscriberComponent,
    PublisherComponent,
    PendingCallDialogComponent,
    PatientInfoComponent,
    PatientGeneralInfoComponent,
    QuestionsInfoComponent,
    ConversationComponent,
    SoapComponent,
    ErrorDialogComponent,
  ]
})
export class AdminComponentModule { }
