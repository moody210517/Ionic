import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ConfidentialitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confidentialite',
  templateUrl: 'confidentialite.html',
})
export class ConfidentialitePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtr:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfidentialitePage');
  }

  closeModal(){
    this.viewCtr.dismiss();
  }

}
