import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindersPage } from './finders';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FindersPage,
  ],
  imports: [
    IonicPageModule.forChild(FindersPage),
    TranslateModule.forChild(),
  ],
})
export class FindersPageModule {}
