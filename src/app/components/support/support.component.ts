import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {

  searchQuery = '';
  p: number = 1;
  limit: number = 10;
  totalItems: number = 0;
  data: any[] = [];
  filteredData: any[] = [];
  selectedAccountType: any = '';
  selectedStatus: any = '';
  selectedFeedback: any = null;
  loading: boolean = false;

  @ViewChild('closeModalDetail') closeModalDetail!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getAllFeedBacks();
  }

  getAllFeedBacks() {
    const trimmedSearch = this.searchQuery?.trim() || '';
    const accountType = this.selectedAccountType || '';
    const status = this.selectedStatus || '';
    this.loading = true;
    this.service.get(`help-support?page=${this.p}&limit=${this.limit}&search=${encodeURIComponent(trimmedSearch)}&account_type=${accountType}&status=${status}`).subscribe({
      next: (resp: any) => {
        this.data = resp.data || [];
        this.filteredData = this.data;
        this.totalItems = resp.total || 0;
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
      }
    });
  }

  selectAccountType(type: string) {
    this.selectedAccountType = type;
    this.p = 1;
    this.getAllFeedBacks();
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
    this.p = 1;
    this.getAllFeedBacks();
  }

  onPageChange(page: number) {
    this.p = page;
    this.getAllFeedBacks();
  }

  onSearchChange() {
    this.p = 1;
    this.getAllFeedBacks();
  }

  viewFeedback(id: any) {
    this.service.get(`app-feedback/${id}`).subscribe({
      next: (resp: any) => {
        this.selectedFeedback = resp.data;
      },
      error: error => {
        console.log(error.message);
        this.toastr.error('Failed to load feedback details');
      }
    });
  }

  deleteFeedback(id: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this feedback!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(`app-feedback/${id}`).subscribe({
          next: (resp: any) => {
            if (resp.success === true || resp.message) {
              this.toastr.success(resp.message || 'Feedback deleted successfully');
              if (this.closeModalDetail) {
                this.closeModalDetail.nativeElement.click();
              }
              this.getAllFeedBacks();
            } else {
              this.toastr.warning(resp.message);
            }
          },
          error: (error) => {
            if (error.error?.message) {
              this.toastr.error(error.error.message);
            } else {
              this.toastr.error('Something went wrong!');
            }
          }
        });
      }
    });
  }
  

}
