import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MesAnnoncesPage } from './mes-annonces';
import { TimeAgoPipeModule } from '../../pipes/time-ago-pipe/index';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MesAnnoncesPage,
  ],
  imports: [
    IonicPageModule.forChild(MesAnnoncesPage),
   TimeAgoPipeModule,
   TranslateModule.forChild(),
  ],
})
export class MesAnnoncesPageModule {}
