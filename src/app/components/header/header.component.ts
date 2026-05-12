import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  profileImg: string | ArrayBuffer | null = null;
  firstName: any;
  lastName: any;
  @Output() toggleEvent = new EventEmitter<boolean>();

  constructor(private service: CommonService) { }

  ngOnInit() {
    this.service.refreshSidebar$.subscribe(() => {
      this.loadUserProfile();
    });
    this.loadUserProfile();
  }

  toggleMenu() {
    this.toggleEvent.emit(true);
  }

  loadUserProfile() {
    this.service.get('getAdminProfile').subscribe({
      next: (resp: any) => {
        this.profileImg = resp.data[0].profileImage;
        this.firstName = resp.data[0].firstName;
        this.lastName = resp.data[0].lastName;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }


  logout() {
    this.service.logout();
  }

}
