import {AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ChartDataset, ChartOptions, Plugin, TooltipItem} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-charts-device-reading',
  templateUrl: './charts-device-reading.component.html',
  styleUrls: ['./charts-device-reading.component.scss']
})
export class ChartsDeviceReadingComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;
  @ViewChild('chart') chart: BaseChartDirective;
  @Input() chartData: ChartDataset[] = [];
  @Input() plugins: {
    [key: string]: any
  };
  chartPlugins: Plugin[];
  @Input() leftText: TemplateRef<any>;
  @Input() rightText: TemplateRef<any>;
  @Input() chartLabels: string[];
  @Input() chartOptions: ChartOptions = {};
  @Input() background: string | undefined;
  @Input() chartColor: string | undefined;
  @Input() unit: string | undefined;
  optionsDefault: ChartOptions = {
    responsive: true,
    scales: {
      xAxis: {
        display: false,
        grid: {
          drawBorder: false // removes random border at bottom
        }
      },
      yAxis: {
        display: false
      }
    },
    elements: {
      point: {
        // radius: 0,
        hoverBackgroundColor: 'rgba(0,0,0,0)'
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        titleFont: {
          size: 10
        },
        bodyFont: {
          size: 10
        },
        displayColors: false,
        includeInvisible: true,
        callbacks: {
          label: (tooltipItem: TooltipItem<any>): string | string[] => {
            return tooltipItem.formattedValue + ' ' + this.unit;
          },
        }
      },
    },
  };

  constructor() { }

  ngOnInit(): void {
    if (this.plugins) {
      this.chartPlugins = Object.keys(this.plugins)?.map(plugin => {
        const draw = this.plugins[plugin];
        return {
          id: plugin,
          ...draw
        };
      });
    }
    this.chartOptions = {...this.optionsDefault, ...this.chartOptions};
  }

  ngAfterViewInit(): void {
    if (this.canvasElement && this.chartColor && this.background) {
      const gradient = this.canvasElement.nativeElement.getContext('2d')?.createLinearGradient(0, 0, 100, 600);
      gradient?.addColorStop(0, this.chartColor);
      gradient?.addColorStop(.2, this.background);
      gradient?.addColorStop(.3, this.background);
      gradient?.addColorStop(.4, this.background);
      // gradient?.addColorStop(.6, '#FFFBF0');
      // gradient?.addColorStop(.8, '#FFFBF0');
      gradient?.addColorStop(1, this.background);
      this.chartData[0].backgroundColor = gradient;
      this.chart.render();
    }
  }
}
