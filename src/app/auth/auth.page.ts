import {Component, OnInit} from '@angular/core';
import {AuthResponseData, AuthService} from './auth.service';
import {Router} from '@angular/router';
import {AlertController, LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    isLoading = false;
    isLogin = true;

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) {
    }

    ngOnInit() {
    }

    authenticate(email: string, password: string) {
        this.isLoading = true;
        this.loadingCtrl.create({
            keyboardClose: true,
            message: 'Logging in....'
        }).then(loadingEl => {
            loadingEl.present();
            let authObs: Observable<AuthResponseData>;
            if (this.isLogin) {
                authObs = this.authService.login(email, password);
            } else {
                authObs = this.authService.signup(email, password);
            }
            authObs.subscribe(resData => {
                console.log(resData);
                this.isLoading = false;
                loadingEl.dismiss();
                this.router.navigateByUrl('/movies/tabs/search');
            }, errRes => {
                loadingEl.dismiss();
                const code = errRes.error.error.message;
                let message = 'Could not sing you up, please try again.';
                if (code === 'EMAIL_EXISTS') {
                    message = 'This email address exists already!';
                } else if (code === 'EMAIL_NOT_FOUND') {
                    message = 'Email address could not be found.';
                } else if (code === 'INVALID_PASSWORD') {
                    message = 'This password is not correct.';
                }
                this.showAlert(message);
            });
        });
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        console.log(email, password);

        this.authenticate(email, password);
    }

    onSwitchAuthMode() {
        this.isLogin = !this.isLogin;
    }

    private showAlert(message: string) {
        this.alertCtrl.create({
            header: 'Authentication failed',
            message: message,
            buttons: ['Okay']
        }).then(alertEl => alertEl.present());
    }

}
