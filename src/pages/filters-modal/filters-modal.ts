import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FiltersModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filters-modal',
  templateUrl: 'filters-modal.html',
})
export class FiltersModalPage {
private filter:any={
  price:false,
  distance:false,
  date:true,
  lat:0,
  lng:0,
};

structure: any = { lower: 15, upper: 30 };
  constructor(public navCtrl: NavController,
    private zone:NgZone,
    public navParams: NavParams,
  private viewCtrl:ViewController) {
    this.filter=this.navParams.get("filter");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltersModalPage');
  }

  filtred() {
    this.filter.range=this.structure;
    setTimeout(()=>{
      this.viewCtrl.dismiss({filter:this.filter});
    },10)
   
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

distanceSelect(e){
  console.log(e._value)
  if(e._value){
    this.zone.run(()=>{
    this.filter.date=false;
    this.filter.price=false;
    console.log(this.filter);
    })
    }
}
dateSelect(e){
  console.log(e._value)
  if(e._value){
    this.zone.run(()=>{
    this.filter.distance=false;
    this.filter.price=false;
    console.log(this.filter);
    })
    }
  }
priceSelect(e){
  console.log(e._value)
  if(e._value){
    this.zone.run(()=>{
    this.filter.distance=false;
    this.filter.date=false;
    console.log(this.filter);
    })
    }
    }
}
