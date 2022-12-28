import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
export const AppRoutingModule: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
];
