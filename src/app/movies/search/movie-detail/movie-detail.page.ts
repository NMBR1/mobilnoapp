import {Component, OnDestroy, OnInit} from '@angular/core';
import {Movie} from '../../movie.model';
import {Subscription} from 'rxjs';
import {ActionSheetController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {MoviesService} from '../../movies.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit, OnDestroy {
  movie: Movie;
  private movieSub: Subscription;

  constructor(
      private navCtrl: NavController,
      private route: ActivatedRoute,
      private moviesService: MoviesService,
      private modalCtrl: ModalController,
      private actionSheetCtrl: ActionSheetController,
      private loadingCtrl: LoadingController,
      private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('movieId')) {
        this.navCtrl.navigateBack('/movies/tabs/search');
        return;
      }
      this.movieSub = this.moviesService
          .getMovie(paramMap.get('movieId'))
          .subscribe(movie => {
            this.movie = movie;
          });
    });
  }

  ngOnDestroy() {
    if (this.movieSub) {
      this.movieSub.unsubscribe();
    }
  }
}
