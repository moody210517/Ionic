import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsPage } from './products';
import { TimeAgoPipeModule } from '../../pipes/time-ago-pipe/index';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductsPage),
    TimeAgoPipeModule,
    TranslateModule.forChild(),
  ],
})
export class ProductsPageModule {

}
