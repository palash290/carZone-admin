import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-requests',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent {

  searchQuery: string = '';
  p: number = 1;
  limit: number = 10;
  totalItems: number = 0;
  data: any[] = [];
  selectedStatus: string = '';
  loading: boolean = false;


  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getAllRequests();
  }

  getAllRequests() {
    this.loading = true;
    let url = `schedule-visits?page=${this.p}&limit=${this.limit}`;
    if (this.selectedStatus) {
      url += `&status=${this.selectedStatus}`;
    }
    if (this.searchQuery.trim()) {
      url += `&search=${encodeURIComponent(this.searchQuery.trim())}`;
    }

    this.service.get(url).subscribe({
      next: (resp: any) => {
        this.data = resp.data || [];
        this.totalItems = resp.total || 0;
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
        this.toastr.error('Failed to load scheduled requests');
      }
    });
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
    this.p = 1;
    this.getAllRequests();
  }

  onPageChange(page: number) {
    this.p = page;
    this.getAllRequests();
  }

  onSearchChange() {
    this.p = 1;
    this.getAllRequests();
  }




}
