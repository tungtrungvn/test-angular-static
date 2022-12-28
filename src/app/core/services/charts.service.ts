import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import {IVitalChartResponse, IVitalChartType} from '@interfaces/vital.interface';
import {ChartDataset, ChartOptions} from 'chart.js';
import {VitalCodeChart} from '@models/constants/global.constant';
import {HttpParams} from '@angular/common/http';
import {map, merge} from 'rxjs';
import {ChartsApiService} from '@core/services/api/charts-api.service';

const setColorChart = (color: string | undefined) => {
  return {
    borderColor: color,
    pointHoverBorderColor: color,
    pointBackgroundColor: color,
    backgroundColor: color,
    hoverBorderColor: color,
  };
};

const chartData: ChartDataset = {
  // ⤵️ Add these
  data: [],
  borderDash: [2, 3],
  borderWidth: 2,
  borderRadius: 50,
  cubicInterpolationMode: 'monotone',
  pointHoverRadius: 10,
  fill: true,
};

const chartOptions: ChartOptions = {
  interaction: {
    intersect: false
  }
};

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  charts: IVitalChartType[] = [];
  constructor(
    private chartsApiService: ChartsApiService
  ) { }

  groupVitalCharts(firebaseId: string, vitalCode: typeof VitalCodeChart, range: string = 'week') {
    const subscripts = vitalCode.map(vital => {
      return this.chartsApiService.getVitalChartPatient(
          new HttpParams().set('patientId', firebaseId)
              .set('fromdevice', false)
              .set('type', range)
              .set('code', vital.code)
      ).pipe(map(item => {
        item.background = vital.background;
        item.chartColor = vital.chartColor;
        return item;
      }));
    });
    return merge(...subscripts);
  }

  dataChartToChartJS({chartData: {dataSets, labels}, info, period, chartColor, background}: IVitalChartResponse) {
    const start = moment(period.startDate);
    const end = moment(period.endDate);
    labels = [];
    while (start.isBefore(end, 'days')) {
      labels.push(start.format('ddd, MMM D, YYYY'));
      start.add(1, 'days');
    }
    const data: any = dataSets.find(Boolean)?.data.map(i => i || 0);
    const vitalInfo = info.find(Boolean);
    const chart: IVitalChartType = {
      chartData: [{
        label: vitalInfo?.display,
        ...chartData,
        data,
        ...setColorChart(chartColor),
      }],
      chartLabels: labels,
      chartOptions,
      unit: info[0].avg.split(' ')[1],
      total: dataSets.find(Boolean)?.data.reduce((to, nu) => to + (nu || 0), 0),
      display: vitalInfo?.display,
      background,
      chartColor
    };
    return chart;
  }
}
