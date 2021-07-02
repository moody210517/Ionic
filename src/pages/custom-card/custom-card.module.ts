import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomCardPage } from './custom-card';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CustomCardPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomCardPage),
    TranslateModule.forChild(),
  ],
})
export class CustomCardPageModule {}
