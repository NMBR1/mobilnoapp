import {Component, OnDestroy, OnInit} from '@angular/core';
import {MoviesService} from '../movies.service';
import {Movie} from '../movie.model';
import {Subscription} from 'rxjs';
import {MenuController} from '@ionic/angular';
import {SegmentChangeEventDetail} from '@ionic/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {
  loadedMovies: Movie[];
  listedLoadedMovies: Movie[];
  isLoading = false;
  private moviesSub: Subscription;

  constructor(private moviesService: MoviesService,
              private menuCtrl: MenuController) { }

  ngOnInit() {
    this.moviesSub = this.moviesService.movies.subscribe(movies => {
      this.loadedMovies = movies;
      this.listedLoadedMovies = this.loadedMovies.slice(1);
    });
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }

  ngOnDestroy(): void {
    if (this.moviesSub) {
      this.moviesSub.unsubscribe();
    }
  }


}
