import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { HttpHelperProvider } from '../../providers/http-helper/http-helper';
import { UiProvider } from '../../providers/ui/ui';
import { ApiServicesProvider } from '../../providers/api-services/api-services';

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {

  rate: number = 0;
  provider:any={};
  methode:any='post';
  profile:any;
  isProfileOwner: boolean = false;
  constructor(public viewCtrl: ViewController, private navParams: NavParams,
  private http:HttpHelperProvider,
  private ui:UiProvider,
  private services:ApiServicesProvider) {
    this.provider=this.navParams.get('provider') || null;
    this.rate = this.navParams.get('providerRate')|| 0;
    console.log("Show Rate From Modal ",this.rate);
    if(this.rate > 0)
    {
     this.methode='put';
     console.log(this.methode);
    }
  }

  confirm() {
    this.viewCtrl.dismiss(this.rate);
  }

}
