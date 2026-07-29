import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-request-detail',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.css'
})
export class RequestDetailComponent implements OnInit {

  requestId: any;
  requestData: any = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CommonService,
    private toastr: NzMessageService
  ) { }

  ngOnInit() {
    this.requestId = this.route.snapshot.queryParamMap.get('id');
    if (this.requestId) {
      this.getRequestDetails(this.requestId);
    }
  }

  getRequestDetails(id: any) {
    this.loading = true;
    this.service.get(`schedule-visits/${id}`).subscribe({
      next: (resp: any) => {
        this.requestData = resp.data;
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
        this.toastr.error('Failed to load request details');
      }
    });
  }
}
