import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SubCategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sub-categories',
  templateUrl: 'sub-categories.html',
})
export class SubCategoriesPage {
private subcategories:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.subcategories=this.navParams.get("subcategories");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubCategoriesPage');
  }


  dismiss(subcategories) {
    this.viewCtrl.dismiss({link:subcategories});
  }

  closeView(){
    this.viewCtrl.dismiss({link:false});
  }

}
