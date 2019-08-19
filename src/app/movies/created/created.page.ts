import {Component, OnDestroy, OnInit} from '@angular/core';
import {Movie} from '../movie.model';
import {Router} from '@angular/router';
import {IonItemSliding} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {MoviesService} from '../movies.service';

@Component({
  selector: 'app-created',
  templateUrl: './created.page.html',
  styleUrls: ['./created.page.scss'],
})
export class CreatedPage implements OnInit, OnDestroy {
  movies: Movie[];
  private moviesSub: Subscription;

  constructor(private placesService: MoviesService, private router: Router) {
  }

  ngOnInit() {
    this.moviesSub = this.placesService.movies.subscribe(movies => {
      this.movies = movies;
    });
  }

  onEdit(movieId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'movies', 'tabs', 'created', 'edit', movieId]);
    console.log('Editing item', movieId);
  }

  ngOnDestroy() {
    if (this.moviesSub) {
      this.moviesSub.unsubscribe();
    }
  }
}
