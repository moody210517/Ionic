import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscussionPage } from './discussion';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DiscussionPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscussionPage),
    TranslateModule.forChild(),
  ],
})
export class DiscussionPageModule {}
