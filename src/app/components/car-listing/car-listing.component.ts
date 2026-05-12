import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-listing',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './car-listing.component.html',
  styleUrl: './car-listing.component.css'
})
export class CarListingComponent {

  searchQuery = '';
  date: any = '';
  status: any = '';
  p: any = 1;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getBuseSchedule();
  }

  data: any;

  getBuseSchedule() {
    const trimmedSearch = this.searchQuery?.trim() || '';
    this.service.get(`listallCar?search=${trimmedSearch}&createdAt=${this.date}&isActive=${this.status}`).subscribe({
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


}
