import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServicesProvider } from '../../providers/api-services/api-services';

/**
 * Generated class for the FovoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fovories',
  templateUrl: 'fovories.html',
})
export class FovoriesPage {
private products:any=[];
private filtred:any=[];
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private services:ApiServicesProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    this.getfavories();
  }

  getfavories(){
    this.services.getfavories().then((res:any)=>{
      console.log("This is a Log From FavoriesPage",res);
      this.products=res;
      this.filtred=this.products;
      }).catch(err=>{
        console.log(err);
        this.services.fireError(err);
      })
  }

  gotoDetails(product){
    this.navCtrl.push('ProductDetailsPage',{product:product});
  }

  filterItems(ev: any) {
    let val = ev.target.value;
    this.filtred=this.products;
    if (val && val.trim() !== '') {
      console.log("This is The value ",val," / ",val.trim());
      this.filtred = this.filtred.filter(function(item) {
        console.log(item);
        return item.title.toLowerCase().includes(val.toLowerCase());
      });
      console.log("After-Filter-Search : ",this.products);
    }
  }

  change(date){
    console.log(date);
    console.log(new Date(date));
    return new Date(date);
  }

  delete(prodcut){
    this.services.deleteFavory(prodcut.id).then(res=>{this.getfavories();}).catch(err=>{console.log(err);})
  }
}

