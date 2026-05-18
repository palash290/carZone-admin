import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-private',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './private.component.html',
  styleUrl: './private.component.css'
})
export class PrivateComponent {

  searchQuery = '';
  date: any = '';
  status: any = '';
  p: any = 1;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getAllPrivate();
  }

  data: any;

  getAllPrivate() {
    const trimmedSearch = this.searchQuery?.trim() || '';
    this.service.get(`getAllPrivateAccounts?search=${trimmedSearch}&createdAt=${this.date}&isActive=${this.status}`).subscribe({
      next: (resp: any) => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
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
              this.getAllPrivate();
            }
          })
        } else {
          //this.toastr.warning('Something went wrong!');
          this.getAllPrivate();
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
              this.getAllPrivate();
            }
          })
        } else {
          //this.toastr.warning('Something went wrong!');
          this.getAllPrivate();
        }
      });
    }
  }


}
