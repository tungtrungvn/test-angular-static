import {Component, Input, OnInit} from '@angular/core';
import {IVitalChartType} from '@interfaces/vital.interface';
import {ChartsService} from '@core/services/charts.service';
import {VitalCodeChart} from '@models/constants/global.constant';

@Component({
  selector: 'app-patient-health-data',
  templateUrl: './patient-health-data.component.html',
  styleUrls: ['./patient-health-data.component.scss']
})
export class PatientHealthDataComponent implements OnInit {
  @Input() firebaseId: string;
  chartTimeRange = 'week';
  charts: IVitalChartType[] = [];
  constructor(
    private chartsService: ChartsService
  ) { }

  ngOnInit(): void {
    this.chartsService.groupVitalCharts(this.firebaseId, VitalCodeChart, this.chartTimeRange)
        .subscribe(res => {
          this.charts.push(this.chartsService.dataChartToChartJS(res));
        });
  }

}
