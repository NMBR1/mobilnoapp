import {Component, OnDestroy, OnInit} from '@angular/core';
import {MoviesService} from '../movies.service';
import {Movie} from '../movie.model';
import {Observable, Subscription} from 'rxjs';
import {MenuController, NavController} from '@ionic/angular';
import {SegmentChangeEventDetail} from '@ionic/core';
import {FormControl, NgModel} from '@angular/forms';
import {debounceTime, map} from 'rxjs/operators';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {
    loadedMovies: Movie[] = [];
    listedLoadedMovies: Movie[];
    isLoading = false;
    private moviesSub: Subscription;

    searchTerm = '';
    searchControl: FormControl;
    items: Movie[];
    searching: any = false;

    constructor(private moviesService: MoviesService,
                private menuCtrl: MenuController,
                private navCtrl: NavController) {
        this.searchControl = new FormControl();
    }

    ngOnInit() {
        this.moviesSub = this.moviesService.movies.subscribe(movies => {
            this.loadedMovies = movies;
            this.listedLoadedMovies = this.listedLoadedMovies;
            this.items = this.loadedMovies;
        });

        this.setFilteredItems();
        /*
                this.searchControl.valueChanges
                    .pipe(debounceTime(600))
                    .subscribe(() => {
                        this.setFilteredItems();
                        this.searching = false;
                    });*/
    }

    /*    ionViewDidLoad() {
            console.log('ZASTO NECE DA SE IZVRSAVA');
            this.setFilteredItems();

            this.searchControl.valueChanges.subscribe(search => {
                this.searching = false;
                this.setFilteredItems();

            });
        }*/

    onSearchInput() {
        this.searching = true;
        // @ts-ignore
        setTimeout(console.log('CEKANJE'), 500);
        this.setFilteredItems();
    }

    setFilteredItems() {
        this.items = this.moviesService.filterItems(this.searchTerm);
        this.searching = false;
    }

    ionViewWillEnter() {
        this.isLoading = true;
        this.moviesService.fetchMovies().subscribe(() => {
            this.isLoading = false;
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
