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
    items: Movie[];

    constructor(private moviesService: MoviesService,
                private menuCtrl: MenuController,
                private navCtrl: NavController) {
    }

    ngOnInit() {
        this.moviesSub = this.moviesService.movies.subscribe(movies => {
            this.loadedMovies = movies;
            this.listedLoadedMovies = this.listedLoadedMovies;
            this.items = this.loadedMovies;
        });
        /*this.setFilteredItems();*/
    }



    onSearchInput() {
        // @ts-ignore
        setTimeout(console.log('CEKANJE'), 500);
        this.setFilteredItems();
    }

    setFilteredItems() {
        this.items = this.moviesService.filterItems(this.searchTerm);
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
