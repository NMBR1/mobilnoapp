import {Injectable} from '@angular/core';
import {BehaviorSubject, generate, Observable, of, Subscription} from 'rxjs';
import {take, map, tap, delay, switchMap} from 'rxjs/operators';
import {Movie} from './movie.model';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';

interface MovieData {
    description: string;
    imageUrl: string;
    title: string;
    rating: number;
    year: number;
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

    private filteredMovies: Movie[] = [];

    filterItems(searchTerm) {
        return this.filteredMovies.filter(movie => {
            return movie.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
    }

    get movies() {
        return this._movies.asObservable();
    }


    constructor(private authService: AuthService,
                private httpClient: HttpClient) {
    }

    fetchMoviesByUser() {
        return this.httpClient.get<{ [key: string]: MovieData }>('https://mobilnoapp.firebaseio.com/movies.json')
            .pipe(map(resData => {
                    const movies = [];
                    let userId: string = '';
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            // tslint:disable-next-line:max-line-length
                            userId = this.authService.vratiUsera();
                            if (userId === resData[key].userId ) {
                                movies.push(new Movie(
                                    key,
                                    resData[key].title,
                                    resData[key].description,
                                    resData[key].imageUrl,
                                    resData[key].rating,
                                    resData[key].year,
                                    resData[key].userId
                                ));
                            }
                        }
                    }
                    this.filteredMovies = movies;
                    // return movies;
                    return movies;
                }),
                tap(movies => {
                    this._movies.next(movies);
                })
            );
    }


    fetchMovies() {
        return this.httpClient.get<{ [key: string]: MovieData }>('https://mobilnoapp.firebaseio.com/movies.json')
            .pipe(map(resData => {
                    const movies = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            // tslint:disable-next-line:max-line-length
                            movies.push(new Movie(
                                key,
                                resData[key].title,
                                resData[key].description,
                                resData[key].imageUrl,
                                resData[key].rating,
                                resData[key].year,
                                resData[key].userId
                            ));
                         /*   this.filteredMovies.push(new Movie(
                                key,
                                resData[key].title,
                                resData[key].description,
                                resData[key].imageUrl,
                                resData[key].rating,
                                resData[key].userId
                            ));*/
                        }
                    }
                    this.filteredMovies = movies;
                    // return movies;
                    return movies;
                }),
                tap(movies => {
                    this._movies.next(movies);
                })
            );
    }

    getMovie(id: string) {
        return this.httpClient.get<MovieData>(`https://mobilnoapp.firebaseio.com/movies/${id}.json`).pipe(
            map(movieData => {
                return new Movie(id, movieData.title, movieData.description, movieData.imageUrl, movieData.rating, movieData.year, movieData.userId);
            }));
    }

    deleteMovie(movieId: string) {
        return this.httpClient.delete(`https://mobilnoapp.firebaseio.com/movies/${movieId}.json`);
    }

    addMovie(
        title: string,
        description: string,
        imageUrl: string,
        rating: number,
        year: number
    ) {
        let generatedId: string;
        let newMovie;
        return this.authService.userId.pipe(take(1), switchMap(
            userId => {
                if (!userId) {
                    throw new Error('No user id found!');
                }
                newMovie = new Movie(
                    Math.random().toString(),
                    title,
                    description,
                    imageUrl,
                    rating,
                    year,
                    userId
                );
                return this.httpClient.post<{ name: string }>('https://mobilnoapp.firebaseio.com/movies.json',
                    {...newMovie, id: null});
            }), switchMap(resData => {
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
        let updatedMovies: Movie[];
        return this.movies.pipe(
            take(1), switchMap(movies => {
                if (!movies || movies.length <= 0) {
                    return this.fetchMovies();
                } else {
                    return of(movies);
                }
            }),
            switchMap(movies => {
                const updateMovieIndex = movies.findIndex(mo => mo.id === movieId);
                updatedMovies = [...movies];
                const oldMovie = updatedMovies[updateMovieIndex];
                // tslint:disable-next-line:max-line-length
                updatedMovies[updateMovieIndex] = new Movie(oldMovie.id, title, description, oldMovie.imageUrl, oldMovie.rating, oldMovie.year, oldMovie.userId);
                return this.httpClient.put(`https://mobilnoapp.firebaseio.com/movies/${movieId}.json`,
                    {...updatedMovies[updateMovieIndex], id: null});
            })
            , tap(() => {
                this._movies.next(updatedMovies);
            }));
    }
}
