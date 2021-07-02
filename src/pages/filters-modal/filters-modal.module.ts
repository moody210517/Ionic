import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FiltersModalPage } from './filters-modal';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FiltersModalPage,
  ],
  imports: [
    IonicPageModule.forChild(FiltersModalPage),
    TranslateModule.forChild(),
  ],
})
export class FiltersModalPageModule {}
