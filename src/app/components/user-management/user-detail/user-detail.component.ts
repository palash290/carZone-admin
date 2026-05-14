import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import localeDeCH from '@angular/common/locales/de-CH';

registerLocaleData(localeDeCH);
Swiper.use([Navigation, Thumbs]);

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {
  //fetchUserById

  carId: any;
  carFeaturesList: any[] = [];
  thumbsSwiper: any;
  type: any;
  openingTimes: any[] = [];

  constructor(private service: CommonService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.carId = this.route.snapshot.queryParamMap.get('id');
    this.type = this.route.snapshot.queryParamMap.get('type');
    this.getUserDetails(this.carId);
  }

  userData: any;
  images: any[] = [];

  getUserDetails(carId: any) {
    this.service.get(`fetchUserById?id=${carId}`).subscribe({
      next: (resp: any) => {
        this.userData = resp.data;

        // this.images = resp.data.carImages?.length > 0 ? resp.data.carImages : ['img/no_car.png'];

        // const features = resp.data.carFeatures ? resp.data.carFeatures : [];
        // this.carFeaturesList = features?.split(',').map((f: string) => f.trim());
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getDayName(day: string): string {
    const days: any = {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday'
    };

    return days[day] || day;
  }

  formatTime(time: string): string {
    if (!time) return '';

    const [hours, minutes] = time.split(':');

    const hour = +hours;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
  }

  onVideoModalClose() {
    const video = document.getElementById('videoFrame') as HTMLVideoElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
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
    }, 2000);
  }


}
