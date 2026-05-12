import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'car-zone-admin';
  showLoader = false;
  constructor(private router: Router, private loaderService: LoaderService) {
  }
  ngOnInit() {

  }
}
