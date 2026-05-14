import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-company',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

  searchQuery = '';
  date: any = '';
  status: any = '';
  p: any = 1;
  loading: boolean = false;
  @ViewChild('closeModalAccept') closeModalAccept!: ElementRef;
  @ViewChild('closeModalReject') closeModalReject!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getBuseSchedule();
  }

  data: any;

  getBuseSchedule() {
    const trimmedSearch = this.searchQuery?.trim() || '';
    this.service.get(`getAllCompanyAccounts?search=${trimmedSearch}&createdAt=${this.date}&is_activated=${this.status}`).subscribe({

      next: (resp: any) => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  onEmfStatusChange(id: any, overrideStatus: string | null, originalStatus?: string): void {
    const statusToUse = overrideStatus || originalStatus;

    if (!statusToUse) {
      this.toastr.warning('Please select a valid status');
      return;
    }

    const statusLabels: any = {
      valid: 'Valid',
      due_soon: 'Due Soon',
      overdue: 'Overdue',
      no_data: 'No Data'
    };

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to change MFK Car Status to "${statusLabels[statusToUse]}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const formURlData = new URLSearchParams()
        formURlData.set('id', id)
        formURlData.set('status', statusToUse)

        this.service.put('changeMfkCarStatus', formURlData.toString()).subscribe({
          next: (resp: any) => {
            this.toastr.success(resp.message || 'Status updated successfully!');
          },
          error: (err) => {
            this.toastr.warning('Failed to update MFK Car Status');
          }
        });
      } else {
        this.getBuseSchedule();
        this.toastr.warning('Action cancelled');
      }
    });
  }

  accept() {
    this.loading = true;
    this.service.post(`approveCompany/${this.companyId}`, '').subscribe({
      next: (resp: any) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.getBuseSchedule();
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
    const formURlData = new URLSearchParams();
    formURlData.set('action', 'rejected');
    formURlData.set('planType', 'custom');
    this.service.post(`rejectCompany/${this.companyId}`, formURlData.toString()).subscribe({
      next: (resp: any) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.getBuseSchedule();
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

  companyId: any;

  getId(item: any) {
    // this.item = item;
    this.companyId = item.id;
  }


}
