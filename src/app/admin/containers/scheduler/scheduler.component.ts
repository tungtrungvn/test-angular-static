import {Component, HostListener} from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationService } from '@app/core/services/notification.service';
import { environment as env } from '@env/environment';
import { createStore } from 'devextreme-aspnet-data-nojquery';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent {
  updateRequest: any;
  appointmentsData: any;
  currentDate: Date = new Date();
  colors = ['#76c68b', '#6bbedc', '#f08d3a', '#a682c7', '#53b894', '#E289DE', '#E6DE73'];
  constructor(private _authService: AuthService,
              private _notificationService: NotificationService) {
    const url = env.apiUrl + '/scheduler';
    this.appointmentsData = createStore(this.getConfig({
      key: 'id',
      loadUrl: url,
      updateUrl: url,
      insertUrl: url,
      deleteUrl: url,
    }));
  }

  getConfig(options: any) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const token = this._authService.getToken();
    options.onBeforeSend = (method: string, ajaxOptions: any) => {
      if (method === 'update') {
        this.updateRequest = ajaxOptions.data;
      } else if (method === 'insert') {
        ajaxOptions.data.exceptScheduleId = this.updateRequest?.key;
      }

      ajaxOptions.headers = {
        'x-time-zone': `${timezone}`,
        Authorization: `Bearer ${token}`
      };
    };

    options.onAjaxError = (e: any) => {
      if (e?.error) {
        this._notificationService.error(e.error);
      }
    };
    options.onInserted = () => {
      this.updateRequest = null;
    };
    return options;
  }

  getBackgroundColor(template: any): string {
    const startDate: Date = new Date(template.targetedAppointmentData.startDate);
    const day = startDate.getDay();
    const totalColor = this.colors.length;
    const index = day % totalColor;
    return this.colors[index];
  }
  onAppointmentFormOpening($event: any): void {
    this.updateRequest = null;
    // const form = $event.form;
    // form.getEditor("text")._$element.closest('.dx-box-item').addClass('hidden');
    // form.getEditor("description")._$element.closest('.dx-box-item').addClass('hidden');
  }
}
