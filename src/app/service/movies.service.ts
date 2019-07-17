import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(
    private http: HttpClient
  ) { }

  getMovies(year) {
    const apiKey = environment.API_KEY;
    const url = `${environment.URL_MOVIE_DB}/discover/movie?primary_release_year=${year}&sort_by=release_date.asc&api_key=${apiKey}&language=es`;

    return this.http.get(url)
      .pipe( 
        map((response: any) => {
          return response
        })
      )
  }
}
