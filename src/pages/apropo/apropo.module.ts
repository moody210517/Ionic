import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApropoPage } from './apropo';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ApropoPage,
  ],
  imports: [
    IonicPageModule.forChild(ApropoPage),
    TranslateModule.forChild(),
  ],
})
export class ApropoPageModule {}
