import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-report',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {

  searchQuery: string = '';
  p: number = 1;
  limit: number = 10;
  totalItems: number = 0;
  data: any[] = [];
  filteredData: any[] = [];
  selectedAccountType: string = '';
  loading: boolean = false;
  @ViewChild('closeModalAccept') closeModalAccept!: ElementRef;
  @ViewChild('closeModalReject') closeModalReject!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getAllReportedCars();
  }

  getAllReportedCars() {
    this.loading = true;
    let url = `reported-cars?page=${this.p}&limit=${this.limit}&account_type=${this.selectedAccountType}`;
    if (this.searchQuery.trim()) {
      url += `&search=${encodeURIComponent(this.searchQuery.trim())}`;
    }

    this.service.get(url).subscribe({
      next: (resp: any) => {
        this.data = resp.data || [];
        this.filteredData = this.data;
        this.totalItems = resp.total || 0;
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
        this.toastr.error('Failed to load reported listings');
      }
    });
  }

  selectAccountType(type: string) {
    this.selectedAccountType = type;
    this.p = 1;
    this.getAllReportedCars();
  }

  onPageChange(page: number) {
    this.p = page;
    this.getAllReportedCars();
  }

  onSearchChange() {
    this.p = 1;
    this.getAllReportedCars();
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

  requestId: any;

  getId(item: any) {
    this.requestId = item.report_id;
  }

  accept() {
    this.loading = true;
    const payload = {
      'status': 'approved'
    }
    this.service.put(`report-car/${this.requestId}/status`, payload).subscribe({
      next: (resp: any) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.getAllReportedCars();
          this.closeModalAccept.nativeElement.click();
        } else {
          this.toastr.warning(resp.message);
          this.loading = false;
        }
      },
      error: (error) => {
        this.loading = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }

  reject() {
    this.loading = true;
    const payload = {
      'status': 'rejected'
    }
    // const formURlData = new URLSearchParams();
    // formURlData.set('action', 'rejected');
    // formURlData.set('planType', 'custom');
    this.service.put(`report-car/${this.requestId}/status`, payload).subscribe({
      next: (resp: any) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.getAllReportedCars();
          this.closeModalReject.nativeElement.click();
        } else {
          this.toastr.warning(resp.message);
          this.loading = false;
        }
      },
      error: (error) => {
        this.loading = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }

}
