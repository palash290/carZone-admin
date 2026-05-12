import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-slot-requests',
  imports: [CommonModule, FormsModule, NgxPaginationModule, FormsModule, ReactiveFormsModule],
  templateUrl: './slot-requests.component.html',
  styleUrl: './slot-requests.component.css'
})
export class SlotRequestsComponent {

  searchQuery = '';
  date: any = '';
  p: any = 1;
  data: any;
  form!: FormGroup;
  loading: boolean = false;
  slotId: any;
  @ViewChild('closeModalAccept') closeModalAccept!: ElementRef;
  @ViewChild('closeModalReject') closeModalReject!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.form = new FormGroup({
      price: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[+]?\d+(\.\d+)?$/),
        Validators.min(0.01)
      ]),
      message: new FormControl('', Validators.required)
    });
    this.getAllSlots();
  }


  getAllSlots() {
    // const trimmedSearch = this.searchQuery?.trim() || '';
    this.service.get(`getAllSlotRequests`).subscribe({
      next: (resp: any) => {
        this.data = resp.data;
        this.filterTable();
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  filteredData: any[] = [];
  selectedStatus: string = 'ALL';

  filterTable() {
    this.p = 1;
    let filtered = this.data;

    if (this.selectedStatus != 'ALL') {
      filtered = filtered.filter((item: { status: string; }) => item.status == this.selectedStatus);
    }

    if (this.searchQuery.trim()) {
      const keyword = this.searchQuery.trim().toLowerCase();
      filtered = filtered.filter((item: { fullName: string; }) =>
        (item.fullName?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  accept() {
    this.form.markAllAsTouched();
    const price = this.form.value.price?.trim();
    const message = this.form.value.message?.trim();

    if (!price || !message) {
      return;
    }
    if (this.form.invalid) {
      return
    }
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('action', 'approved');
    formURlData.set('adminMessage', this.form.value.message);
    formURlData.set('price', this.form.value.price);
    formURlData.set('planType', 'custom');
    this.service.put(`updateSlotRequestStatus/${this.slotId}`, formURlData.toString()).subscribe({
      next: (resp: any) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.getAllSlots();
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
    this.service.put(`updateSlotRequestStatus/${this.slotId}`, formURlData.toString()).subscribe({
      next: (resp: any) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.getAllSlots();
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

  item: any;

  getId(item: any) {
    this.item = item;
    this.slotId = item.id;
  }


}
