import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FovoriesPage } from './fovories';
import { PipesModule } from '../../pipes/pipes.module';
import { TimeAgoPipeModule } from '../../pipes/time-ago-pipe/index';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    FovoriesPage,

  ],
  imports: [
    IonicPageModule.forChild(FovoriesPage),
    TimeAgoPipeModule,
    TranslateModule.forChild(),
  ],
})
export class FovoriesPageModule {}
