import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-detail',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.css'
})
export class ReportDetailComponent implements OnInit {

  reportId: any;
  reportData: any = null;
  loading: boolean = false;

  readonly reasonMap: Record<string, string> = {
    '1': 'Spam or misleading content',
    '2': 'Fraud or scam',
    '3': 'Inappropriate content',
    '4': 'Incorrect pricing / details',
    '5': 'Wrong Photos / Documents'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CommonService,
    private toastr: NzMessageService
  ) { }

  ngOnInit() {
    this.reportId = this.route.snapshot.queryParamMap.get('id');
    if (this.reportId) {
      this.getReportDetails(this.reportId);
    }
  }

  getReportDetails(id: any) {
    this.loading = true;
    this.service.get(`reported-car/${id}`).subscribe({
      next: (resp: any) => {
        this.reportData = resp.data;
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
        this.toastr.error('Failed to load report details');
      }
    });
  }

  getReportedAs(reportedAs: any): string {
    if (!reportedAs) {
      return '';
    }
    if (Array.isArray(reportedAs)) {
      return reportedAs.join(', ');
    }
    return String(reportedAs);
  }

  deleteReportedCar() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this reported listing!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.service.delete(`reported-car/${this.reportId}`).subscribe({
          next: (resp: any) => {
            this.toastr.success(resp.message || 'Reported listing deleted successfully');
            this.loading = false;
            this.router.navigate(['/home/report']);
          },
          error: error => {
            console.log(error.message);
            this.loading = false;
            this.toastr.error(error.error?.message || 'Failed to delete reported listing');
          }
        });
      }
    });
  }
}
