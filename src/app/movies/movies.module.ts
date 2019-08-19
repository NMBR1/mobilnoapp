import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { MoviesPage } from './movies.page';
import {MoviesRoutingModule} from './movies-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MoviesRoutingModule
  ],
  declarations: [MoviesPage]
})
export class MoviesPageModule {}
