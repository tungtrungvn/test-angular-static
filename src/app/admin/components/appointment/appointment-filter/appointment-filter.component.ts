import {ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { VideoService } from '@app/core/services/video.service';
import { IAppointmentTotalInfo } from '@app/models/interfaces/videocall.interface';
import { debounceTime } from 'rxjs';
import {ResponsiveDetected} from '@core/utils/responsive-detected.util';

@Component({
  selector: 'app-appointment-filter',
  templateUrl: './appointment-filter.component.html',
  styleUrls: ['./appointment-filter.component.scss']
})
export class AppointmentFilterComponent implements OnInit {
  @Input() range: FormGroup | undefined;
  @Input() statusSelected: string;
  @Output() rangeDateChange: EventEmitter<any> = new EventEmitter();
  @Output() statusChange: EventEmitter<any> = new EventEmitter();
  @Output() filterAppt: EventEmitter<string> = new EventEmitter();
  totalAppointmentToday = 0;
  patient = new FormControl();
  hidePanel = true;

  constructor(private videoService: VideoService, private responsiveUtil: ResponsiveDetected, private ref: ChangeDetectorRef) {
    this.responsiveUtil.init(ref);
    this.hidePanel = !this.responsiveUtil.isMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.hidePanel = !this.responsiveUtil.isMobile();
  }

  ngOnInit(): void {
    this.getTotalToday();
    this.patient.valueChanges.pipe(
      debounceTime(500),
   ).subscribe(patientName => this.filterAppt.emit(patientName));
  }

  onEndDateChange($event: any) {
    if (this.range && this.range.value?.end) {
      this.rangeDateChange.emit(this.range.value);
    }
  }

  onStatusChange($event: any) {
    const { value } = $event;
    this.statusChange.emit(value);
  }

  getTotalToday(): void {
    this.videoService.getTotalAppointmentToday().subscribe(
      (response: IAppointmentTotalInfo) => {
        this.totalAppointmentToday = response.totalForToday;
      }
    );
  }
}
