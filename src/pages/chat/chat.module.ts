import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { PipesModule } from '../../pipes/pipes.module';
import { MomentModule } from 'ngx-moment';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChatPage,
  ],
  imports: [
    PipesModule,
    MomentModule,
    IonicPageModule.forChild(ChatPage),
    TranslateModule.forChild(),
  ],
})
export class ChatPageModule {}
