import {ChartDataset, ChartOptions} from 'chart.js';

export interface IVitalSignResponse {
  code: string;
  uom?: string;
  value?: number;
  valueToStr?: string;
  issued?: Date;
  components?: IVitalSignResponse[];
}

export interface IVitalInfoResponse {
  code: string;
  avg: string;
  display: string;
  max: string;
  maxNumber: number;
  min: string;
  minNumber: number;
}

export interface IVitalChartResponse {
  chartData: {
    dataSets: [{
      data: any[]
    }],
    labels: string[]
  };
  info: IVitalInfoResponse[];
  period: {
    endDate: string,
    startDate: string
  };
  background?: string;
  chartColor?: string;
}

export interface IVitalChartType {
  chartData: ChartDataset[];
  chartLabels: string[];
  chartOptions: ChartOptions;
  unit: string | undefined;
  total: number;
  display: string | undefined;
  background?: string | undefined;
  chartColor?: string | undefined;
}
