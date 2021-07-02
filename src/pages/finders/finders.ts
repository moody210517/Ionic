import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { UiProvider } from '../../providers/ui/ui';

@IonicPage()
@Component({
  selector: 'page-finders',
  templateUrl: 'finders.html',
})
export class FindersPage {
  private recherches: any = [];

  constructor(public navCtrl: NavController, private services: ApiServicesProvider, public navParams: NavParams, private ui: UiProvider) {
  }

  getsearches() {
    this.services.getsearches().then((res: any) => {
      this.recherches = res.suivis.reverse();
    });
  }

  ionViewDidLoad() {
    this.getsearches();
  }

  delete(suivi_id, index) {
    this.services.deletesearch(suivi_id).then((res: any) => {
      this.recherches.splice(index, 1);
      // this.getsearches();
    }).catch((err: any) => {
      console.log(err);
    })
  }

  goto(product) {
    this.services.getproductbyId(product.id).then((res: any) => {
      this.navCtrl.push('ProductDetailsPage', { product: res.json() });
    }).catch(e => {
      console.log(e);
    })
  }

  async doRefresh(refresher) {
    this.services.getsearches().then((res: any) => {
      console.log("Searches here => ", res.suivis);
      this.recherches = res.suivis;
      refresher.complete();
    }, err => {
      this.ui.fireError(err);
      refresher.complete();
    });

  }
}
