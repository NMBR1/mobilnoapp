import {Component, OnDestroy, OnInit} from '@angular/core';
import {Movie} from '../../movie.model';
import {Subscription} from 'rxjs';
import {ActionSheetController, AlertController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
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
        private router: Router,
        private moviesService: MoviesService,
        private modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        private loadingCtrl: LoadingController,
        private authService: AuthService,
    ) {
    }

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

    async  onDelete(id: string) {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Deleting movies',
            buttons: [{
                text: 'Delete',
                icon: 'trash',
                handler: () => {
                    console.log('Deleting .........');
                    this.loadingCtrl.create({
                        message: 'Deleting movie...'
                    }).then(loadingEl => {
                        loadingEl.present();
                        this.moviesService.deleteMovie(id).subscribe(() => {
                            loadingEl.dismiss();
                            this.router.navigate(['/movies/tabs/search']);
                        });
                    });
                }
            }, {
                text: 'Cancel',
                icon: 'close',
                handler: () => {
                    console.log('Canceled clicked');
                    this.router.navigate(['/movies/tabs/search']);
                }
            }]
        });

        await actionSheet.present();
    }


    ngOnDestroy(): void {
        if (this.movieSub) {
            this.movieSub.unsubscribe();
        }
    }
}
