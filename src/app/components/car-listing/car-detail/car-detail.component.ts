import { CommonModule, registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { CommonService } from '../../../services/common.service';
import { Location } from '@angular/common';
import { Navigation, Thumbs } from 'swiper/modules';
// import { VideoPlayerComponent } from "../../video-player/video-player.component";
import localeDeCH from '@angular/common/locales/de-CH';
import { VideoPlayerComponent } from '../../video-player/video-player.component';

registerLocaleData(localeDeCH);
Swiper.use([Navigation, Thumbs]);

//VideoPlayerComponent
@Component({
  selector: 'app-car-detail',
  imports: [RouterLink, CommonModule, VideoPlayerComponent],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.css'
})
export class CarDetailComponent {

  carId: any;
  carFeaturesList: any[] = [];
  thumbsSwiper: any;


  constructor(private service: CommonService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.carId = this.route.snapshot.queryParamMap.get('id');
    this.getBuseSchedule(this.carId);
  }

  carData: any;
  images: any[] = [];

  getBuseSchedule(carId: any) {
    this.service.get(`fetchCarById?id=${carId}`).subscribe({
      next: (resp: any) => {
        this.carData = resp.data;

        this.images = resp.data.carImages.length > 0 ? resp.data.carImages : ['img/no_car.png'];

        const features = resp.data.carFeatures ? resp.data.carFeatures : [];
        this.carFeaturesList = features?.split(',').map((f: string) => f.trim());
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


  ngAfterViewInit() {
    // Wait for DOM and Swiper setup
    setTimeout(() => {
      this.thumbsSwiper = new Swiper('.mySwiperThumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        loop: false
      });

      new Swiper('.mySwiperMain', {
        spaceBetween: 10,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        thumbs: {
          swiper: this.thumbsSwiper,
        },
      });
    }, 2000); // or use ngZone.runOutsideAngular if needed
  }

  backClicked() {
    this.location.back();
  }


}
