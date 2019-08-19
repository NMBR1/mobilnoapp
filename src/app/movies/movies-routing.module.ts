import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MoviesPage} from './movies.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: MoviesPage,
        children: [
            {
                path: 'search',
                children: [
                    {
                        path: '',
                        loadChildren: './search/search.module#SearchPageModule'
                    },
                    {
                        path: ':movieId',
                        loadChildren: './search/movie-detail/movie-detail.module#MovieDetailPageModule'
                    }
                ]
            },
            {
                path: 'created',
                children: [
                    {
                        path: '',
                        loadChildren: './created/created.module#CreatedPageModule'
                    },
                    {
                        path: 'new',
                        loadChildren: './created/new-movies/new-movies.module#NewMoviesPageModule'
                    },
                    {
                        path: 'edit/:movieId',
                        loadChildren: './created/edit-movies/edit-movies.module#EditMoviesPageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/movies/tabs/search',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/movies/tabs/created',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MoviesRoutingModule {
}
