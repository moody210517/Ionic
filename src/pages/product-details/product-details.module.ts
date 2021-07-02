import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductDetailsPage } from './product-details';
import { IonicRatingModule } from 'ionic-rating';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProductDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductDetailsPage),
    IonicRatingModule,
     TranslateModule.forChild(),
  ],
})
export class ProductDetailsPageModule {}
