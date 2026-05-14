import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  showUserManagementSubmenu = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.showUserManagementSubmenu = this.isUserManagementActive();
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  isUserManagementActive(): boolean {
    return this.router.url.startsWith('/home/user-management')
      || this.router.url.startsWith('/home/private')
      || this.router.url.startsWith('/home/company');
  }

  isUserManagementSubmenuActive(type: 'private' | 'company'): boolean {
    return this.router.url.startsWith(`/home/${type}`);
  }

  toggleUserManagementSubmenu(): void {
    this.showUserManagementSubmenu = !this.showUserManagementSubmenu;
  }

}
