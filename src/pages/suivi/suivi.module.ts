import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuiviPage } from './suivi';
import { ColorPickerModule } from 'ngx-color-picker';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SuiviPage,
  ],
  imports: [
    IonicPageModule.forChild(SuiviPage),
    ColorPickerModule,
    TranslateModule.forChild()
  ],
})
export class SuiviPageModule {}
