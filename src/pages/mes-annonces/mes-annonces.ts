import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServicesProvider } from '../../providers/api-services/api-services';

@IonicPage()
@Component({
  selector: 'page-mes-annonces',
  templateUrl: 'mes-annonces.html',
})
export class MesAnnoncesPage {
  private products: any = [];
  searchterm: any;
  showspinner = false;
  private page: number = 1;
  private filtred: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private services: ApiServicesProvider
  ) { 
    this.loadproducts();
  }

  getdatfromdateBase(ev: any) {
    let val = ev.target.value;
    this.searchterm = val;
    if (val) {
      this.showspinner = true;
      this.products = [];
      this.filtred = [];
      this.services.getsearchMyAds(val).then((res: any) => {
        this.showspinner = false;
        setTimeout(() => {
          this.products = res;
          this.filtred = res;
        }, 0);
      })
    } else {
      this.page = 0;
      this.showspinner = false;
      this.loadproducts();
    }
  }

  loadproducts() {
    this.services.getmyproducts(null).then((res: any) => {
      console.log("This is a Log From FavoriesPage", res);
      this.products = res;
      this.filtred = this.products;
    }).catch(err => {
      console.log(">>>>>>>>>", err);
    })
  }

  gotoDiscussion(product) {
    this.navCtrl.push('ProductDetailsPage', { product: product });
  }

  filterItems(ev: any) {
    let val = ev.target.value;
    this.filtred = this.products;
    if (val && val.trim() !== '') {
      console.log("This is The value ", val, " / ", val.trim());
      this.filtred = this.filtred.filter(function (item) {
        console.log(item);
        return item.title.toLowerCase().includes(val.toLowerCase());
      });
      console.log("After-Filter-Search : ", this.products);
    }
  }

  change(date) {
    console.log(date)
    return new Date(date);
  }

  delete(product) {
    this.services.delete(product).then(res => {
      console.log("Delete : ", res);
      this.loadproducts();
    }).catch(err => {
      this.services.fireError(err);
    });
  }

  edit(product) {
    this.navCtrl.push("AddProductsPage", { modify: true, product_to_edit: product });
  }

  doInfinite(infiniteScroll) {
    if (!this.searchterm) {
      this.page++;
      this.services.getmyproducts(this.page, true).then((res: any) => {
        console.log("This is a Log From FavoriesPage", res);
        this.products = res;
        res.forEach(element => {
          this.filtred.push(element);
        });
        setTimeout(() => {
          this.products = this.filtred;
        }, 10);
        if (res.length == 0) {
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();
      }).catch(err => {
        console.log(err);
        infiniteScroll.complete();
      })
    }
  }

}
