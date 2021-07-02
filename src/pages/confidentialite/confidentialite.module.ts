import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfidentialitePage } from './confidentialite';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ConfidentialitePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfidentialitePage),
    TranslateModule.forChild(),
  ],
})
export class ConfidentialitePageModule {}
