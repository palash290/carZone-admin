import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-transactions',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

  searchQuery = '';
  date: any = '';
  p: any = 1;
  data: any;

  constructor(private service: CommonService) { }

  ngOnInit() {
    this.getTrx();
  }

  getTrx() {
    this.service.get(`getTransaction-slot-summary`).subscribe({
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
      filtered = filtered.filter((item: { username: string; }) =>
        (item.username?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }


}
