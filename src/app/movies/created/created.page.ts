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
  movies: Movie[] = [];
  isLoading = false;
  private moviesSub: Subscription;

  constructor(private moviesService: MoviesService, private router: Router) {
  }

  ngOnInit() {
    this.moviesSub = this.moviesService.movies.subscribe(movies => {
      this.movies = movies;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.moviesService.fetchMovies().subscribe(() => {
      this.isLoading = false;
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
