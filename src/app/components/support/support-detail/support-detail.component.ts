import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-support-detail',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './support-detail.component.html',
  styleUrl: './support-detail.component.css'
})
export class SupportDetailComponent implements OnInit {

  supportId: any;
  supportData: any = null;
  adminResponse: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CommonService,
    private toastr: NzMessageService
  ) { }

  ngOnInit() {
    this.supportId = this.route.snapshot.queryParamMap.get('id');
    if (this.supportId) {
      this.getSupportDetails(this.supportId);
    }
  }

  getSupportDetails(id: any) {
    this.loading = true;
    this.service.get(`help-support/${id}`).subscribe({
      next: (resp: any) => {
        this.supportData = resp.data;
        if (this.supportData) {
          this.adminResponse = this.supportData.admin_response || '';
        }
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
        this.toastr.error('Failed to load support details');
      }
    });
  }

  resolveSupport() {
    if (!this.adminResponse?.trim()) {
      this.toastr.warning('Please enter a response message');
      return;
    }

    this.loading = true;
    const body = {
      admin_response: this.adminResponse.trim()
    };

    this.service.put(`help-support/${this.supportId}`, body).subscribe({
      next: (resp: any) => {
        this.toastr.success(resp.message || 'Support request answered and resolved');
        this.loading = false;
        this.router.navigate(['/home/support']);
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
        this.toastr.error(error.error?.message || 'Failed to resolve support request');
      }
    });
  }

  
}
