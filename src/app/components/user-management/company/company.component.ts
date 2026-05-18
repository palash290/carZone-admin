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
    this.getCompanyList();
  }

  data: any;

  getCompanyList() {
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

  accept() {
    this.loading = true;
    this.service.post(`approveCompany/${this.companyId}`, '').subscribe({
      next: (resp: any) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.getCompanyList();
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
          this.getCompanyList();
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

    handleCheckboxChange(row: any) {
      if (row.isBlocked == 1) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to unblock this buyer!",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          cancelButtonText: "No"
        }).then((result) => {
          if (result.isConfirmed) {
            const formURlData = new URLSearchParams();
            //console.log()
            formURlData.set('user_id', row.id);
            formURlData.set('role', 'buyer');
            formURlData.set('isBlocked', '0');
            this.service.post(`blocked1`, formURlData).subscribe({
              next: (resp: any) => {
                this.toastr.success(resp.message);
                this.getCompanyList();
              }
            })
          } else {
            //this.toastr.warning('Something went wrong!');
            this.getCompanyList();
          }
        });
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to block this buyer!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          cancelButtonText: "No"
        }).then((result) => {
          if (result.isConfirmed) {
            const formURlData = new URLSearchParams();
            formURlData.set('user_id', row.id);
            formURlData.set('role', 'buyer');
            formURlData.set('isBlocked', '1');
            this.service.post(`blocked1`, formURlData).subscribe({
              next: (resp: any) => {
                this.toastr.success(resp.message);
                this.getCompanyList();
              }
            })
          } else {
            //this.toastr.warning('Something went wrong!');
            this.getCompanyList();
          }
        });
      }
    }


}
