import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { ApiServicesProvider } from '../../providers/api-services/api-services';

/**
 * Generated class for the CustomCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-custom-card',
  templateUrl: 'custom-card.html',
})
export class CustomCardPage {
private notify:any={};
private profile:any={};
  constructor(public navCtrl: NavController,
    private services:ApiServicesProvider,
    private viewCtr:ViewController,private callNumber: CallNumber,public navParams: NavParams) {
    this.notify=this.navParams.get("notify");
    this.profile=this.navParams.get("profile");
    console.log(this.notify);
    console.log(this.profile);


  }

  SendSms(){
    if(this.services.isLoggedIn){
      this.navCtrl.push("ChatPage",{product:this.notify.product,opner:this.profile});
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomCardPage');
  }

  cancel(){
    this.viewCtr.dismiss();
}

dialCall(){
  console.log('callPerson',this.notify);
  let called=this.profile.phone.substr(1,this.profile.phone.length);
  this.callNumber.callNumber("0033"+called, true)
  .then(res => {
    console.log('Launched dialer!', res);
    this.viewCtr.dismiss();
  })
  .catch(err => console.log('Error launching dialer', err));
}

}
