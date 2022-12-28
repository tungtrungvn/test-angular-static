import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {map, merge} from 'rxjs';
import moment from 'moment-timezone';
import {VitalCode} from '@enums/vitalSign.enum';
import {VitalCodeChart} from '@models/constants/global.constant';
import {IVitalChartType} from '@interfaces/vital.interface';
import {ChartsApiService} from '@core/services/api/charts-api.service';
import {ChartsService} from "@core/services/charts.service";

@Component({
  selector: 'app-patient-device-reading',
  templateUrl: './patient-device-reading.component.html',
  styleUrls: ['./patient-device-reading.component.scss']
})
export class PatientDeviceReadingComponent implements OnInit, OnChanges {
  @Input() firebaseId: string;
  @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;
  charts: IVitalChartType[] = [];
  vitalCode = [
    VitalCode.CALORIES,
    VitalCode.WEIGHT,
    VitalCode.BMI,
    VitalCode.BODY_FAT
  ];
  chartTimeRange = 'week';

  constructor(
    private chartService: ChartsService
  ) {  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.firebaseId?.currentValue) {
      this.charts = [];
      this.loadingChart();
    }
  }

  loadingChart() {
    const charts: IVitalChartType[] = [];
    this.chartService.groupVitalCharts(
        this.firebaseId, VitalCodeChart.filter(vtc => this.vitalCode.includes(vtc.code)), this.chartTimeRange).subscribe(res => {
      charts.push(this.chartService.dataChartToChartJS(res));
    });
    this.charts = charts;
  }
}
