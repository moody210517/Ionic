import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProductsPage } from './add-products';
import { LongPressModule } from 'ionic-long-press';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddProductsPage,
  ],
  imports: [
    LongPressModule,
    IonicPageModule.forChild(AddProductsPage),
    TranslateModule.forChild(),
  ],
})
export class AddProductsPageModule {}
