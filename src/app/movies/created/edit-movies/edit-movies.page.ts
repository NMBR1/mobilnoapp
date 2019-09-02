import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MoviesService} from '../../movies.service';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Movie} from '../../movie.model';

@Component({
    selector: 'app-edit-movies',
    templateUrl: './edit-movies.page.html',
    styleUrls: ['./edit-movies.page.scss'],
})
export class EditMoviesPage implements OnInit, OnDestroy {
    movie: Movie;
    movieId: string;
    form: FormGroup;
    isLoading = false;
    private movieSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private moviesService: MoviesService,
        private navCtrl: NavController,
        private router: Router,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('movieId')) {
                this.navCtrl.navigateBack('/movies/tabs/created');
                return;
            }
            this.movieId = paramMap.get('movieId');
            this.isLoading = true;
            this.movieSub = this.moviesService
                .getMovie(paramMap.get('movieId'))
                .subscribe(movie => {
                        this.movie = movie;
                        this.form = new FormGroup({
                            title: new FormControl(this.movie.title, {
                                updateOn: 'blur',
                                validators: [Validators.required]
                            }),
                            description: new FormControl(this.movie.description, {
                                updateOn: 'blur',
                                validators: [Validators.required, Validators.maxLength(180)]
                            })
                        });
                        this.isLoading = false;
                    }, error => {
                        this.alertCtrl.create({
                            header: 'An error occured',
                            message: 'Movie could not be fetched. Please try again',
                            buttons: [{
                                text: 'Okay', handler: () => {
                                    this.router.navigate(['/movies/tabs/created']);
                                }
                            }]
                        }).then(alertEl => {
                            alertEl.present();
                        });
                    }
                );
        });
    }

    onUpdateMovie() {
        if (!this.form.valid) {
            return;
        }
        this.loadingCtrl
            .create({
                message: 'Updating movie...'
            })
            .then(loadingEl => {
                loadingEl.present();
                this.moviesService
                    .updateMovie(
                        this.movie.id,
                        this.form.value.title,
                        this.form.value.description
                    )
                    .subscribe(() => {
                        loadingEl.dismiss();
                        this.form.reset();
                        this.router.navigate(['/movies/tabs/created']);
                    });
            });
    }

    ngOnDestroy() {
        if (this.movieSub) {
            this.movieSub.unsubscribe();
        }
    }
}
