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
        this.getAllPrivate();
        this.toastr.warning('Action cancelled');
      }
    });
  }


}
