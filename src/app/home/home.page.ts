import { Component, ViewChild } from '@angular/core';
import { MoviesService } from '../service/movies.service';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('slide') private slide: IonSlides
  years: any[] = [];
  movies: any[] = [
    {
      img: './../../assets/img/noImg.gif',
      title: 'MOVIE NAME'
    }
  ];
  yearSelected: number = 0;
  ratingArray: any[] = [
    {
      value: 1,
      icon: 'remove-circle-outline',
    },
    {
      value: 2,
      icon: 'remove-circle-outline',
    },
    {
      value: 3,
      icon: 'remove-circle-outline',
    },
    {
      value: 4,
      icon: 'remove-circle-outline',
    },
    {
      value: 5,
      icon: 'remove-circle-outline',
    }
  ];

  constructor(
    public moviesService: MoviesService,
    private storage: Storage
  ) {
    this.loadYearsOptions();
  }

  loadYearsOptions() {
    for (let index = 2010; index <= 2019; index++) {
      this.years.push({
        name: index,
        value: index
      })
    }
  };

  async setRating(ratingVal, movie) {
    const dataFromStorage = await this.storage.get(String(this.yearSelected));

    if(dataFromStorage){
      this.movies = dataFromStorage;
    }

    this.movies.filter(item => {
      if(item.id === movie.id){
        item.rating = ratingVal
      }
    })
    
    for (let index = 0; index < this.ratingArray.length; index++) {
      if (index < ratingVal) {
        this.ratingArray[index].icon = 'add-circle';
      } else {
        this.ratingArray[index].icon = 'remove-circle-outline';
      }
    }
    
    this.storage.set(String(this.yearSelected), this.movies);
  };

  getMoviesApi(yearSelected) {
    this.moviesService.getMovies(yearSelected)
      .subscribe(async (data: any) => {
        data.results.forEach(movie => {
          this.movies.push({
            img: movie.poster_path ? `http://image.tmdb.org/t/p/w300${movie.poster_path}` : './../../assets/img/noImg.gif',
            title: movie.title,
            id: movie.id,
            rating: 0
          })
        })
        this.storage.set(String(this.yearSelected), this.movies);
        this.setRating(this.movies[0].rating, this.movies);
        await this.slide.slideTo(0);
      });
  };

  async changeYear(event) {
    this.movies = [];
    this.yearSelected = event.target.value.value;

    const dataFromStorage = await this.storage.get(String(this.yearSelected));

    if (dataFromStorage) {
      dataFromStorage.forEach(movie => {
        this.movies.push({
          img: movie.img ? movie.img : './../../assets/img/noImg.gif',
          title: movie.title,
          id: movie.id,
          rating: movie.rating || 0
        })
      })
      this.setRating(this.movies[0].rating, this.movies);
    } else {
      this.getMoviesApi(this.yearSelected);
    }
  };

  async nextSlide() {
    const index = await this.slide.getActiveIndex();
    
    if (this.movies.length > 0) {
      const isEnd = await this.slide.isEnd();
      if (isEnd) {
        await this.slide.slideTo(0);
      } else {
        this.slide.slideNext().then(response => response);
      }
      this.setRating(this.movies[index + 1].rating, this.movies[index+1]);
    }
  };

  async prevSlide() {
    if (this.movies.length > 0) {
      const index = await this.slide.getActiveIndex();
      await this.slide.slidePrev();
      this.setRating(this.movies[index - 1].rating, this.movies[index+1]);
    }
  };
}
