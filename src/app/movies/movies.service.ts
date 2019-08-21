import {Injectable} from '@angular/core';
import {BehaviorSubject, generate} from 'rxjs';
import {take, map, tap, delay, switchMap} from 'rxjs/operators';
import {Movie} from './movie.model';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';

interface MovieData {
    description: string;
    imageUrl: string;
    title: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class MoviesService {
    /*
        [
        new Movie('m4', 'The Shawshank Redemption', 'Neki opis filma', 'https://images-na.ssl-images-amazon.com/images/I/717W9DCnyzL._SL1500_.jpg', 'u1'),
        new Movie('m1', '2 Guns', 'Neki opis filma', 'https://images.mymovies.net/images/film/cin/350x522/fid8426.jpg', 'u1'),
        new Movie('m2', 'Fast and Furious 9', 'Neki opis filma', 'https://static2.srcdn.com/wordpress/wp-content/uploads/2019/02/Fast-and-Furious-9-fake-logo.jpg', 'u1'),
        new Movie('m3', 'The Brothers Grimsby', 'Neki opis filma', 'https://musicart.xboxlive.com/7/d0ff5000-0000-0000-0000-000000000002/504/image.jpg?w=1920&h=1080', 'u1')
    ]*/
    // @ts-ignore
    // tslint:disable-next-line:variable-name
    private _movies: BehaviorSubject<Movie[]> = new BehaviorSubject<Movie[]>();

    get movies() {
        return this._movies.asObservable();
    }

    constructor(private authService: AuthService,
                private httpClient: HttpClient) {
    }

    fetchMovies() {
        return this.httpClient.get<{ [key: string]: MovieData }>('https://mobilnoapp.firebaseio.com/movies.json')
            .pipe(map(resData => {
                    const movies = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            // tslint:disable-next-line:max-line-length
                            movies.push(new Movie(key, resData[key].title, resData[key].description, resData[key].imageUrl, resData[key].userId));
                        }
                    }
                    // return movies;
                    return [];
                }),
                tap(movies => {
                    this._movies.next(movies);
                })
            );
    }

    getMovie(id: string) {
        return this.movies.pipe(
            take(1),
            map(movies => {
                return {...movies.find(p => p.id === id)};
            })
        );
    }

    addMovie(
        title: string,
        description: string,
    ) {
        let generatedId: string;
        const newMovie = new Movie(
            Math.random().toString(),
            title,
            description,
            'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
            this.authService.userId
        );
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post<{ name: string }>('https://mobilnoapp.firebaseio.com/movies.json', {...newMovie, id: null}).pipe(
            switchMap(resData => {
                generatedId = resData.name;
                return this.movies;
            }),
            take(1),
            tap(movies => {
                newMovie.id = generatedId;
                // @ts-ignore
                this._movies.next(movies.concat(newMovie));
            }));
        /*return this.movies.pipe(
            take(1),
            delay(1000),
            tap(movies => {
              this._movies.next(movies.concat(newMovie));
            })
        );*/
    }

    updateMovie(movieId: string, title: string, description: string) {
        return this.movies.pipe(take(1), delay(1000), tap(movies => {
            const updateMovieIndex = movies.findIndex(mo => mo.id === movieId);
            const updatedMovies = [...movies];
            const oldMovie = updatedMovies[updateMovieIndex];
            // tslint:disable-next-line:max-line-length
            updatedMovies[updateMovieIndex] = new Movie(oldMovie.id, title, description, oldMovie.imageUrl, 'm1');
            this._movies.next(updatedMovies);
        }));
    }
}
