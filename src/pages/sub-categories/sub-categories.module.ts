import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubCategoriesPage } from './sub-categories';

@NgModule({
  declarations: [
    SubCategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(SubCategoriesPage),
  ],
})
export class SubCategoriesPageModule {}
