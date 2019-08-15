import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'movies', loadChildren: './movies/movies.module#MoviesPageModule' },
  { path: 'search', loadChildren: './movies/search/search.module#SearchPageModule' },
  { path: 'new-movies', loadChildren: './movies/new-movies/new-movies.module#NewMoviesPageModule' },
  { path: 'edit-movies', loadChildren: './movies/edit-movies/edit-movies.module#EditMoviesPageModule' },
  { path: 'movie-detail', loadChildren: './movies/search/movie-detail/movie-detail.module#MovieDetailPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
