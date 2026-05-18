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

  readonly statusLabelMap: Record<string, string> = {
    valid: 'Valid',
    due_soon: 'Due Soon',
    overdue: 'Overdue',
    no_data: 'No Data'
  };

  readonly conditionLabelMap: Record<string, string> = {
    '1': 'New',
    '2': 'Used'
  };

  getBuseSchedule(carId: any) {
    this.service.get(`fetchCarById?id=${carId}`).subscribe({
      next: (resp: any) => {
        this.carData = resp.data;

        const carImages = Array.isArray(resp.data?.carImages) ? resp.data.carImages : [];
        this.images = carImages.length > 0 ? carImages : ['img/no_car.png'];

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
      const thumbsElement = document.querySelector('.mySwiperThumbs');
      const mainElement = document.querySelector('.mySwiperMain');

      if (!mainElement) {
        return;
      }

      if (thumbsElement) {
        this.thumbsSwiper = new Swiper('.mySwiperThumbs', {
          spaceBetween: 10,
          slidesPerView: 4,
          watchSlidesProgress: true,
          slideToClickedSlide: true,
          loop: false
        });
      }

      new Swiper('.mySwiperMain', {
        spaceBetween: 10,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        thumbs: this.thumbsSwiper ? {
          swiper: this.thumbsSwiper,
        } : undefined,
      });
    }, 2000); // or use ngZone.runOutsideAngular if needed
  }

  backClicked() {
    this.location.back();
  }

  formatValue(value: any, suffix = ''): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return `${value}${suffix}`;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatBoolean(value: any): string {
    if (value === null || value === undefined) {
      return '-';
    }

    return Number(value) === 1 ? 'Yes' : 'No';
  }

  formatStatus(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    return this.statusLabelMap[value] || value.replace(/_/g, ' ');
  }

  get mapLink(): string {
    if (this.carData?.latitude && this.carData?.longitude) {
      return `https://www.google.com/maps?q=${this.carData.latitude},${this.carData.longitude}`;
    }

    if (this.carData?.location) {
      return `https://www.google.com/maps?q=${encodeURIComponent(this.carData.location)}`;
    }

    return 'https://www.google.com/maps';
  }


}
