import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, MenuController } from 'ionic-angular';
import * as $ from "jquery";
import { ProductsPage } from '../products/products';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { UiProvider } from '../../providers/ui/ui';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private banners: any = [];
  private toogle_info: boolean = false;
  private categorys: any = [];
  private doinfinity: any;
  private products: any = [];
  private counts_products: any = null;
  private page: number = 1;
  private region: any;
  private list: boolean = false;
  private filter: any = {
    price: false,
    distance: false,
    date: true,
    lat: 0,
    lng: 0
  };
  private filtred: any = [];
  private search_key: any;
  private search_address: any;
  constructor(public navCtrl: NavController, private params: NavParams,
    public menuCtrl: MenuController,
    private services: ApiServicesProvider, private ui: UiProvider) {
    this.services.countsProduct().then(data => {
      this.counts_products = data;
    })

    console.log("Welcome To Home Page ");
    $(function () {
      console.log("Inside Jquery");
      var images = $('.img-card');
      images.each(function () {
        if (!this.complete) {
          console.log("Inside Jquery Images");
          $(this).one('load', function () {
            console.log("Inside Load Event");
            $(this).show();
            $(this).next('.no-contain').hide();
          });
        } else {
          $(this).show();
          $(this).next('.no-contain').hide();
        }
      });

    });
    this.filtred = this.products;
  }
  gotoDetails(product) {
    this.toogle_info = false;
    this.navCtrl.push('ProductDetailsPage', { product: product });
  }

  gotoproducts(category?) {
    this.toogle_info = false;
    this.navCtrl.push('ProductsPage', { category: category });
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

  switchtolist() {
    this.list = !this.list;
    this.loadImages();
  }


  loadImages() {
    $(function () {
      console.log("Inside Jquery");
      var images = $('.img-card');
      images.each(function () {
        if (!this.complete) {
          console.log("Inside Jquery Images");
          $(this).one('load', function () {
            console.log("Inside Load Event");
            $(this).show();
            $(this).next('.no-contain').hide();
          });
        } else {
          $(this).show();
          $(this).next('.no-contain').hide();
        }
      });
    });
  }
  ionViewDidLoad() {
    if (this.params.get("openMenu"))
      this.openMenu();
    this.region = this.params.get("region");
    if (this.region) {
      console.log("Region to Search ", this.region);
      this.services.getProductsByRegion(this.region, this.page).then((products) => {
        console.log("This IS The Products Recived ", products);
        console.log("region changed");
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", products);
        this.products = products;
        this.loadImages();
      }).catch((err) => {
        console.log("Request Error", err);
      })
    }
    else {
      console.log("Find All")
      this.services.getAllProducts(this.page, false, this.filter).then((products) => {
        this.products = products;
        this.loadImages();
      }).catch((error) => {
        console.log("Error : ", error);
      });
    }
  }

  openMenu() {
    this.menuCtrl.open();
  }

  change(date) {
    console.log(date);
    console.log(new Date(date));
    return new Date(date);
  }

  getspeceficProducts() {
    this.services.getProductsBySearch(this.search_address, this.search_key).then((res: any) => {
      if (res.products)
        this.products = res.products;
      else
        this.products = res;
      this.toogle_info = false;
      this.region = this.search_address;
      this.loadImages();
      console.log(this.products);
    }).catch((err) => {
      this.ui.toast('Erreur : Recherche non Abouti');
    });
  }

  addFavories(current_product) {
    if (this.services.isLoggedIn) {
      this.services.addfavories(current_product.id).then((res) => {
        this.ui.toast("Ce produit est Favori");
      }).catch((err) => {
        this.services.fireError(err);
      });
    }
    else {
      this.ui.confirmation("s'identifier ! ", "Identfiez Vous pour Consulter la Conversation").then(() => {
        this.navCtrl.push('LoginPage');
      });
    }
  }

  doInfinite(infiniteScroll) {
    this.doinfinity = infiniteScroll;
    this.page++;
    if (this.region) {
      console.log("Region to Search ", this.region);
      this.services.getProductsByRegion(this.region, this.page, true).then((res: any) => {
        console.log("This IS The Products Recived ", res);
        console.log("region changed", this.products);
        if (res.length > 0) {
          res.forEach(element => {
            this.products.push(element);
          });
          console.log("this is the Filtred From Infinity Scroll >>>", this.products);
          // setTimeout(() => {
          //   this.products=this.filtred;
          //   console.log("this is the Product From Infinity Scroll >>>",this.products);
          //   this.loadImages();
          // }, 10);

        } else {
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();
        setTimeout(() => {
          this.loadImages();
        }, 5);
      }).catch((err) => {
        infiniteScroll.complete();
        console.log("Request Error", err);
      })
    } else {
      this.services.getAllProducts(this.page, true, this.filter).then((res: any) => {
        res.forEach(element => {
          this.products.push(element);
        });
        // setTimeout(() => {
        //         this.products=this.filtred;
        //       }, 10);
        this.services.getCurrentLocation(true).then((pos: any) => {
          this.services.current_position.lat = pos.coords.latitude;
          this.services.current_position.lng = pos.coords.longitude;
          console.log("This is The Current Location Information : ", pos);
        }).catch(err => {
          console.log(err);
          // this.services.fireError(err);
        });
        if (res.length == 0) {
          this.doinfinity.enable(false);
        }
        this.doinfinity.complete();
        setTimeout(() => {
          this.loadImages();
        }, 5);

      }).catch(err => {
        console.log(err);
        // this.services.fireError(err);
        this.doinfinity.complete();
      })
    }
  }


}
