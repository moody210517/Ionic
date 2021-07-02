import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { AppConfigProvider } from '../../providers/app-config/app-config';

/**
 * Generated class for the ApropoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-apropo',
  templateUrl: 'apropo.html',
})
export class ApropoPage {

  constructor(public navCtrl: NavController,private appconfig:AppConfigProvider, public navParams: NavParams,private viewCtr:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApropoPage');
  }
  closeModal(){
  this.viewCtr.dismiss();
  }
}
