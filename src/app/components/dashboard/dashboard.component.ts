import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from 'ng-apexcharts';

export type RevenueChartOptions = {
  chart: ApexChart;
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  grid: ApexGrid;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterLink, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  readonly revenueYears = ['2025', '2024', '2023'];
  selectedRevenueYear = '2025';
  revenueAmount = "CHF 45'900.-";
  revenueGrowth = '+5.2%';
  revenueChartOptions: RevenueChartOptions;

  constructor(private service: CommonService) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = [12000, 4560, 28000, 14000, 10000, 16000, 13000, 19000, 22000, 24000, 11000, 22000];

    this.revenueChartOptions = {
      chart: {
        type: 'area',
        height: 260,
        toolbar: { show: false },
        zoom: { enabled: false },
        sparkline: { enabled: false },
        animations: {
          enabled: true,
          speed: 900
        }
      },
      series: [
        {
          name: 'Revenue',
          data: revenueData
        }
      ],
      colors: ['#8F0C1F'],
      xaxis: {
        categories: months,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: Array(months.length).fill('#919EAB'),
            fontSize: '12px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400
          }
        }
      },
      yaxis: {
        show: true,
        tickAmount: 4,
        min: 0,
        max: 45000,
        labels: {
          formatter: (value: number) => (value === 0 ? '0' : `${value / 1000}k`),
          style: {
            colors: ['#919EAB'],
            fontSize: '12px',
            fontFamily: 'DM Sans, sans-serif'
          },
          offsetX: -8
        }
      },
      grid: {
        borderColor: '#E8EAF0',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { left: 4, right: 4, top: 0, bottom: -8 }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.22,
          opacityTo: 0,
          stops: [0, 95],
          colorStops: [
            { offset: 0, color: '#8F0C1F78', opacity: 0.48 },
            { offset: 100, color: '#8F0C1F00', opacity: 0 }
          ]
        }
      },
      markers: {
        size: 0,
        hover: {
          size: 5,
          sizeOffset: 2
        }
      },
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex }) => {
          const amount = series[seriesIndex][dataPointIndex] as number;
          const formatted = `CHF ${amount.toLocaleString('de-CH')}.-`;
          return `<div class="tooltip-title">${months[dataPointIndex]}</div><div class="tooltip-value">${formatted}</div>`;
        }
      },
      dataLabels: { enabled: false },
      legend: { show: false }
    };
  }

  ngOnInit() {
    this.getBuseSchedule();
  }

  cars: any;
  sellers: any;
  totalBuyers: any;
  totalSellers: any;
  totalActiveCars: any;

  getBuseSchedule() {
    this.service.get('getdashboard').subscribe({
      next: (resp: any) => {
        this.totalBuyers = resp.data.totalBuyers;
        this.totalSellers = resp.data.totalSellers;
        this.totalActiveCars = resp.data.totalActiveCars;
        this.cars = resp.data.cars?.slice(0, 3);
        this.sellers = resp.data.sellers?.slice(0, 3);
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


}
