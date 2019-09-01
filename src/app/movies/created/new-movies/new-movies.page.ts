import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MoviesService} from '../../movies.service';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-movies',
  templateUrl: './new-movies.page.html',
  styleUrls: ['./new-movies.page.scss'],
})
export class NewMoviesPage implements OnInit {
  form: FormGroup;

  constructor(
      private moviesService: MoviesService,
      private router: Router,
      private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      imageUrl: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      rating: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1), Validators.max(10)]
      })
    });
  }

  onCreateMovie() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
        .create({
          message: 'Creating movie...'
        })
        .then(loadingEl => {
          loadingEl.present();
          this.moviesService
              .addMovie(
                  this.form.value.title,
                  this.form.value.description,
                  this.form.value.imageUrl,
                  this.form.value.rating
              )
              .subscribe(() => {
                loadingEl.dismiss();
                this.form.reset();
                this.router.navigate(['/movies/tabs/created']);
              });
        });
  }
}
