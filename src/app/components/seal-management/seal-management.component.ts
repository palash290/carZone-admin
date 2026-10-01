import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'app-seal-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './seal-management.component.html',
  styleUrl: './seal-management.component.css'
})
export class SealManagementComponent implements OnInit {
  @ViewChild('closeAddModalBtn') closeAddModalBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeEditModalBtn') closeEditModalBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('addFileInput') addFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editFileInput') editFileInput!: ElementRef<HTMLInputElement>;

  // Data & State
  sealsList: any[] = [];
  loading: boolean = false;
  submitting: boolean = false;
  searchQuery: string = '';
  statusFilter: string = ''; // '' = all, '1' = active, '0' = inactive
  p: number = 1;
  limit: number = 8;
  totalCount: number = 0;

  // Selected seal for detail view
  selectedSeal: any = null;

  // Add Form State
  addName: string = '';
  addDescription: string = '';
  addImageFile: File | null = null;
  addImagePreview: string | null = null;

  // Edit Form State
  editId: any = null;
  editName: string = '';
  editDescription: string = '';
  editStatus: string = '1';
  editImageFile: File | null = null;
  editImagePreview: string | null = null;
  editExistingImage: string | null = null;

  constructor(
    private service: CommonService,
    private toastr: NzMessageService
  ) { }

  ngOnInit(): void {
    this.getQualitySeals();
  }

  // Get Quality Seals list with pagination, search, and status
  getQualitySeals(page: number = this.p): void {
    this.loading = true;
    this.p = page;
    const trimmedSearch = this.searchQuery?.trim() || '';

    const queryParams = `quality-seals?page=${this.p}&limit=${this.limit}&search=${encodeURIComponent(trimmedSearch)}&status=${this.statusFilter}`;

    this.service.get<any>(queryParams).subscribe({
      next: (resp: any) => {
        this.loading = false;
        if (resp) {
          const list = resp.data || resp.qualitySeals || resp.seals || resp.rows || (Array.isArray(resp) ? resp : []);
          this.sealsList = list;
          this.totalCount = resp.total || resp.totalCount || resp.pagination?.total || resp.count || this.sealsList.length;
        } else {
          this.sealsList = [];
          this.totalCount = 0;
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error fetching quality seals:', err);
        this.sealsList = [];
        this.totalCount = 0;
      }
    });
  }

  onSearchChange(): void {
    this.p = 1;
    this.getQualitySeals();
  }

  onStatusFilterChange(): void {
    this.p = 1;
    this.getQualitySeals();
  }

  onPageChange(newPage: number): void {
    this.p = newPage;
    this.getQualitySeals(newPage);
  }

  // Get Single Quality Seal details
  viewSealDetails(seal: any): void {
    this.selectedSeal = seal;
    this.service.get<any>(`quality-seal/${seal.id}`).subscribe({
      next: (resp: any) => {
        if (resp?.data) {
          this.selectedSeal = resp.data;
        }
      },
      error: (err) => {
        console.warn('Could not fetch latest single seal details, showing existing:', err);
      }
    });
  }

  // Add Quality Seal Methods
  openAddModal(): void {
    this.resetAddForm();
  }

  onAddFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toastr.warning('Please select a valid image file (PNG, JPG, SVG, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.warning('Image size should not exceed 5MB');
        return;
      }
      this.addImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.addImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAddImage(): void {
    this.addImageFile = null;
    this.addImagePreview = null;
    if (this.addFileInput?.nativeElement) {
      this.addFileInput.nativeElement.value = '';
    }
  }

  createQualitySeal(): void {
    const name = this.addName?.trim();
    const description = this.addDescription?.trim() || '';

    if (!name) {
      this.toastr.warning('Please enter a Quality Seal name');
      return;
    }

    if (!this.addImageFile) {
      this.toastr.warning('Please upload a Quality Seal image / logo');
      return;
    }

    this.submitting = true;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', this.addImageFile);

    this.service.post<any, FormData>('quality-seal', formData).subscribe({
      next: (resp: any) => {
        this.submitting = false;
        this.closeModal(this.closeAddModalBtn);
        this.resetAddForm();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: resp?.message || 'Quality Seal created successfully!',
          confirmButtonColor: '#8F0C1F'
        });
        this.getQualitySeals();
      },
      error: (err: any) => {
        this.submitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Failed to create',
          text: err?.message || 'An error occurred while creating Quality Seal.',
          confirmButtonColor: '#8F0C1F'
        });
      }
    });
  }

  resetAddForm(): void {
    this.addName = '';
    this.addDescription = '';
    this.addImageFile = null;
    this.addImagePreview = null;
    if (this.addFileInput?.nativeElement) {
      this.addFileInput.nativeElement.value = '';
    }
  }

  // Edit Quality Seal Methods
  openEditModal(seal: any): void {
    this.editId = seal.id;
    this.editName = seal.name || '';
    this.editDescription = seal.description || '';
    this.editStatus = seal.status !== undefined && seal.status !== null ? String(seal.status) : '1';
    this.editExistingImage = seal.image || seal.imageUrl || seal.logo || null;
    this.editImageFile = null;
    this.editImagePreview = null;
    if (this.editFileInput?.nativeElement) {
      this.editFileInput.nativeElement.value = '';
    }

    // Optionally fetch single quality seal to ensure up-to-date data
    this.service.get<any>(`quality-seal/${seal.id}`).subscribe({
      next: (resp: any) => {
        const data = resp?.data || resp;
        if (data && data.name) {
          this.editName = data.name;
          this.editDescription = data.description || '';
          this.editStatus = data.status !== undefined && data.status !== null ? String(data.status) : this.editStatus;
          this.editExistingImage = data.image || data.imageUrl || data.logo || this.editExistingImage;
        }
      },
      error: (err) => {
        console.warn('Using card data for edit:', err);
      }
    });
  }

  onEditFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toastr.warning('Please select a valid image file (PNG, JPG, SVG, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.warning('Image size should not exceed 5MB');
        return;
      }
      this.editImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeEditImage(): void {
    this.editImageFile = null;
    this.editImagePreview = null;
    if (this.editFileInput?.nativeElement) {
      this.editFileInput.nativeElement.value = '';
    }
  }

  updateQualitySeal(): void {
    const name = this.editName?.trim();
    const description = this.editDescription?.trim() || '';

    if (!name) {
      this.toastr.warning('Please enter a Quality Seal name');
      return;
    }

    this.submitting = true;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('status', this.editStatus);

    if (this.editImageFile) {
      formData.append('image', this.editImageFile);
    }

    this.service.put<any, FormData>(`quality-seal/${this.editId}`, formData).subscribe({
      next: (resp: any) => {
        this.submitting = false;
        this.closeModal(this.closeEditModalBtn);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: resp?.message || 'Quality Seal updated successfully!',
          confirmButtonColor: '#8F0C1F'
        });
        this.getQualitySeals();
      },
      error: (err: any) => {
        this.submitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Update failed',
          text: err?.message || 'An error occurred while updating Quality Seal.',
          confirmButtonColor: '#8F0C1F'
        });
      }
    });
  }

  // Toggle status directly with confirmation
  toggleStatus(seal: any, event: Event): void {
    event.stopPropagation();
    const newStatus = seal.status === 1 || seal.status === '1' ? '0' : '1';
    const statusText = newStatus === '1' ? 'Activate' : 'Deactivate';

    Swal.fire({
      title: `${statusText} Quality Seal?`,
      text: `Are you sure you want to ${statusText.toLowerCase()} "${seal.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8F0C1F',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${statusText}`
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('name', seal.name || '');
        formData.append('description', seal.description || '');
        formData.append('status', newStatus);

        this.service.put<any, FormData>(`quality-seal/${seal.id}`, formData).subscribe({
          next: (resp: any) => {
            seal.status = newStatus === '1' ? 1 : 0;
            this.toastr.success(resp?.message || `Quality Seal ${statusText.toLowerCase()}d successfully!`);
          },
          error: (err: any) => {
            this.toastr.error(err?.message || 'Failed to update status');
          }
        });
      }
    });
  }

  // Delete Quality Seal
  deleteQualitySeal(seal: any): void {
    Swal.fire({
      title: 'Delete Quality Seal',
      text: `Are you sure you want to delete "${seal.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8F0C1F',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete<any>(`quality-seal/${seal.id}`).subscribe({
          next: (resp: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: resp?.message || 'Quality Seal deleted successfully.',
              confirmButtonColor: '#8F0C1F'
            });
            this.getQualitySeals();
          },
          error: (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: err?.message || 'Failed to delete Quality Seal.',
              confirmButtonColor: '#8F0C1F'
            });
          }
        });
      }
    });
  }

  // Helper method for resolving image URLs
  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'img/logo/ch_cars_sellers_logo.png';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    const serverOrigin = environment.baseUrl.replace(/\/api\/admin\/?$/, '');
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${serverOrigin}${cleanPath}`;
  }

  // Helper to trigger modal close
  private closeModal(buttonRef: ElementRef<HTMLButtonElement>): void {
    if (buttonRef?.nativeElement) {
      buttonRef.nativeElement.click();
    }
  }
}
