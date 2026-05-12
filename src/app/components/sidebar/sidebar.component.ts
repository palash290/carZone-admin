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

  constructor(private router: Router) { }

  ngOnInit() {
    // this.showClientSubMenu = this.isActive('/home/client-list');
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }


}
