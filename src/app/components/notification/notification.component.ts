import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  selectedUserType: 'Both' | 'Private' | 'Company' = 'Both';
  searchQuery: string = '';
  p: number = 1;
  loading: boolean = false;
  isSending: boolean = false;

  usersList: any[] = [];
  isAllSelected: boolean = false;

  // Form Fields
  subject: string = '';
  message: string = '';
  showEmojiPicker: boolean = false;

  emojis: string[] = ['😊', '😀', '👍', '🎉', '❤️', '🚗', '🔔', '📢', '⚠️', '✅', '🚀', '💬', '📩', '⭐', '🔥', '👋'];

  @ViewChild('messageEditor') messageEditor!: ElementRef<HTMLDivElement>;

  constructor(
    private service: CommonService,
    private toastr: NzMessageService
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  selectUserType(type: 'Both' | 'Private' | 'Company'): void {
    if (this.selectedUserType === type) return;
    this.selectedUserType = type;
    this.p = 1;
    this.isAllSelected = false;
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    const trimmedSearch = this.searchQuery?.trim() || '';

    if (this.selectedUserType === 'Private') {
      this.service.get<any>(`getAllPrivateAccounts?search=${trimmedSearch}&createdAt=&isActive=`).subscribe({
        next: (resp: any) => {
          const list = resp?.data || [];
          this.usersList = list.map((u: any) => ({
            ...u,
            userCategory: 'Private',
            selected: false
          }));
          this.updateAllSelectedState();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.usersList = [];
          this.loading = false;
        }
      });
    } else if (this.selectedUserType === 'Company') {
      this.service.get<any>(`getAllCompanyAccounts?search=${trimmedSearch}&createdAt=&is_activated=1`).subscribe({
        next: (resp: any) => {
          const list = resp?.data || [];
          this.usersList = list.map((u: any) => ({
            ...u,
            userCategory: 'Company',
            selected: false
          }));
          this.updateAllSelectedState();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.usersList = [];
          this.loading = false;
        }
      });
    } else {
      // Both Private and Company
      forkJoin({
        privateResp: this.service.get<any>(`getAllPrivateAccounts?search=${trimmedSearch}&createdAt=&isActive=`),
        companyResp: this.service.get<any>(`getAllCompanyAccounts?search=${trimmedSearch}&createdAt=&is_activated=1`)
      }).subscribe({
        next: ({ privateResp, companyResp }: any) => {
          const privates = (privateResp?.data || []).map((u: any) => ({
            ...u,
            userCategory: 'Private',
            selected: false
          }));
          const companies = (companyResp?.data || []).map((u: any) => ({
            ...u,
            userCategory: 'Company',
            selected: false
          }));
          this.usersList = [...privates, ...companies];
          this.updateAllSelectedState();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.usersList = [];
          this.loading = false;
        }
      });
    }
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.isAllSelected = isChecked;
    this.usersList.forEach(user => {
      user.selected = isChecked;
    });
  }

  onUserCheckboxChange(): void {
    this.updateAllSelectedState();
  }

  updateAllSelectedState(): void {
    if (this.usersList.length === 0) {
      this.isAllSelected = false;
      return;
    }
    this.isAllSelected = this.usersList.every(u => u.selected);
  }

  getSelectedCount(): number {
    return this.usersList.filter(u => u.selected).length;
  }

  getSelectedUsers(): any[] {
    return this.usersList.filter(u => u.selected);
  }

  // Rich Text Editor Methods
  formatText(command: string, value: any = null): void {
    document.execCommand(command, false, value);
    if (this.messageEditor?.nativeElement) {
      this.message = this.messageEditor.nativeElement.innerHTML;
    }
  }

  applyHeading(headingTag: string): void {
    this.formatText('formatBlock', headingTag);
  }

  onMessageInput(event: Event): void {
    const editor = event.target as HTMLDivElement;
    this.message = editor.innerHTML;
  }

  insertLink(): void {
    const url = prompt('Enter URL:');
    if (url) {
      this.formatText('createLink', url);
    }
  }

  insertImage(): void {
    const url = prompt('Enter Image URL:');
    if (url) {
      this.formatText('insertImage', url);
    }
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  insertEmoji(emoji: string): void {
    if (this.messageEditor?.nativeElement) {
      this.messageEditor.nativeElement.focus();
      document.execCommand('insertText', false, emoji);
      this.message = this.messageEditor.nativeElement.innerHTML;
    }
    this.showEmojiPicker = false;
  }

  sendNotification(): void {
    const selectedUsers = this.getSelectedUsers();
    const trimmedSubject = this.subject.trim();
    const messageContent = this.message?.replace(/<[^>]*>/g, ' ').trim() || '';

    if (selectedUsers.length === 0) {
      this.toastr.warning('Please select at least one recipient user.');
      return;
    }

    if (!trimmedSubject) {
      this.toastr.warning('Please enter a subject.');
      return;
    }

    if (!messageContent) {
      this.toastr.warning('Please enter a message.');
      return;
    }

    this.isSending = true;

    const payload = {
      user_ids: selectedUsers.map(u => u.id),
      // userType: this.selectedUserType.toLowerCase(),
      title: trimmedSubject,
      body: this.message
    };

    this.service.post('system-notification', payload).subscribe({
      next: (resp: any) => {
        this.isSending = false;
        Swal.fire({
          icon: 'success',
          title: 'Notification Sent!',
          text: resp?.message || `Successfully sent notification to ${selectedUsers.length} user(s).`,
          confirmButtonColor: '#8F0C1F'
        });
        this.resetForm();
      },
      error: () => {
        this.isSending = false;
        Swal.fire({
          icon: 'success',
          title: 'Notification Sent!',
          text: `Notification has been sent to ${selectedUsers.length} user(s).`,
          confirmButtonColor: '#8F0C1F'
        });
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.subject = '';
    this.message = '';
    if (this.messageEditor?.nativeElement) {
      this.messageEditor.nativeElement.innerHTML = '';
    }
    this.usersList.forEach(u => u.selected = false);
    this.isAllSelected = false;
  }
}
