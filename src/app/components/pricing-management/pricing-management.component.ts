import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing-management',
  imports: [CommonModule],
  templateUrl: './pricing-management.component.html',
  styleUrl: './pricing-management.component.css'
})
export class PricingManagementComponent {

  requestData: any = null;
  loading: boolean = false;

  basicPlan: any = null;
  additionalPlan: any = null;
  monthlyPlans: any[] = [];
  yearlyPlans: any[] = [];

  constructor(
    private service: CommonService,
  ) { }

  ngOnInit() {
    this.getAllPlans();
  }

  getAllPlans() {
    this.loading = true;
    this.service.get(`getAllPlan`).subscribe({
      next: (resp: any) => {
        const plansList = resp.plans || [];
        this.requestData = plansList;
        this.basicPlan = plansList.find((p: any) => p.plan_type === 'basic');
        this.additionalPlan = plansList.find((p: any) => p.plan_type === 'additional');
        this.monthlyPlans = plansList.filter((p: any) => p.plan_type === 'bulk' && p.duration_type === 'monthly');
        this.yearlyPlans = plansList.filter((p: any) => p.plan_type === 'bulk' && p.duration_type === 'yearly');
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
      }
    });
  }

  stripCurrency(price: any): string {
    if (!price) return '';
    const match = String(price).match(/[\d\.]+/);
    return match ? match[0] : String(price);
  }


}
