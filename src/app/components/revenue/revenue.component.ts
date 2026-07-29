import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-revenue',
  imports: [CommonModule, ChartComponent],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.css'
})
export class RevenueComponent implements OnInit {

  requestData: any = null;
  loading: boolean = false;

  revenueChartOptions: any;
  donutChartOptions: any;
  monthlyActiveSubscribers: number = 0;
  yearlyActiveSubscribers: number = 0;
  maxSales: number = 1;

  constructor(
    private service: CommonService,
  ) { }

  ngOnInit() {
    this.getSlotsSoldByPackage();
  }

  getSlotsSoldByPackage() {
    this.loading = true;
    this.service.get(`slots-sold-by-package`).subscribe({
      next: (resp: any) => {
        this.requestData = resp.data;
        this.setupCharts(resp.data);
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
      }
    });
  }

  setupCharts(data: any) {
    if (!data) return;

    // 1. Line / Area Chart for Revenue Overview
    const monthlyRevenue = data.revenueOverview?.monthlyRevenue || [];
    const months = monthlyRevenue.map((m: any) => m.month_name);
    const revenueValues = monthlyRevenue.map((m: any) => parseFloat(m.revenue || '0'));
    const maxVal = Math.max(...revenueValues, 1000);

    this.revenueChartOptions = {
      chart: {
        type: 'area',
        height: 260,
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      series: [
        {
          name: 'Revenue',
          data: revenueValues
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
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        show: true,
        tickAmount: 4,
        min: 0,
        max: maxVal,
        labels: {
          formatter: (value: number) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}k`;
            }
            return String(value);
          },
          style: {
            colors: ['#919EAB'],
            fontSize: '12px'
          }
        }
      },
      grid: {
        borderColor: '#E8EAF0',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
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
        custom: ({ series, seriesIndex, dataPointIndex }: any) => {
          const amount = series[seriesIndex][dataPointIndex] as number;
          const formatted = `CHF ${amount.toLocaleString('de-CH')}.-`;
          return `<div style="padding: 6px 10px; font-family: sans-serif; font-size: 13px;"><div style="font-weight: 600; color: #666;">${months[dataPointIndex]}</div><div style="font-weight: 700; color: #8F0C1F; margin-top: 4px;">${formatted}</div></div>`;
        }
      },
      dataLabels: { enabled: false },
      legend: { show: false }
    };

    // 2. Donut Chart for Plan Distribution
    const planDistribution = data.planDistribution || [];
    const monthlyPlan = planDistribution.find((p: any) => p.duration_type === 'monthly');
    const yearlyPlan = planDistribution.find((p: any) => p.duration_type === 'yearly');
    this.monthlyActiveSubscribers = monthlyPlan ? monthlyPlan.active_subscribers : 0;
    this.yearlyActiveSubscribers = yearlyPlan ? yearlyPlan.active_subscribers : 0;

    this.donutChartOptions = {
      chart: {
        type: 'donut',
        height: 150
      },
      series: [this.monthlyActiveSubscribers, this.yearlyActiveSubscribers],
      labels: ['Monthly Plans', 'Yearly Plans'],
      colors: ['#8F0C1F', '#E8EAF0'],
      legend: { show: false },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: false
            }
          }
        }
      }
    };

    const slotsSold = data.slotsSold || [];
    this.maxSales = Math.max(...slotsSold.map((s: any) => s.sales || 0), 1);
  }

  exportCSV() {
    if (!this.requestData) return;

    let csvContent = "\uFEFF"; // Add UTF-8 BOM
    csvContent += "Category,Metric/Month/Package,Value/Sales,Revenue (CHF)\n";
    
    // Cards metrics
    const cards = this.requestData.cards || {};
    csvContent += `Summary,Total Revenue,${cards.totalRevenue || 0},\n`;
    csvContent += `Summary,Total Slot Packages Sold,${cards.totalSlotPackagesSold || 0},\n`;
    csvContent += `Summary,This Month Revenue,${cards.thisMonthRevenue || 0},\n`;
    csvContent += `Summary,Individual Listings Sold,${cards.individualListingsSold || 0},\n\n`;

    // Monthly revenue overview
    csvContent += "Revenue Overview,Month,Revenue (CHF),\n";
    const monthlyRevenue = this.requestData.revenueOverview?.monthlyRevenue || [];
    monthlyRevenue.forEach((m: any) => {
      csvContent += `Revenue Overview,${m.month_name},${m.revenue || '0.00'},\n`;
    });
    csvContent += "\n";

    // Slots Sold by Package
    csvContent += "Slots Sold,Package Title,Sales Count,Revenue (CHF)\n";
    const slotsSold = this.requestData.slotsSold || [];
    slotsSold.forEach((s: any) => {
      csvContent += `Slots Sold,${s.title},${s.sales || 0},${s.revenue || '0.00'}\n`;
    });
    csvContent += "\n";

    // Plan distribution
    csvContent += "Plan Distribution,Duration Type,Active Subscribers,\n";
    const planDistribution = this.requestData.planDistribution || [];
    planDistribution.forEach((p: any) => {
      csvContent += `Plan Distribution,${p.duration_type},${p.active_subscribers || 0},\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `revenue_report_${this.requestData.revenueOverview?.year || 2026}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
