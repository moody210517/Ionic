import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { ApiServicesProvider } from '../../providers/api-services/api-services';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  private products: any = [];
  private filter: any = {
    price: false,
    distance: false,
    date: false,
    lat: 0,
    lng: 0
  };
  private category: any;
  private searchterm: any;
  showspinner = false;
  private doinfinity: any;
  private page: number = 1;
  private selected: any = null;
  private filtred: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private services: ApiServicesProvider,
    private platform: Platform,
    private modalCtrl: ModalController) {
    this.category = this.navParams.get('category');
  }

  getDistanceFromLatLonInKm(product) {
    if (this.services.current_position) {
      let location = { lat: product.address.lat, lng: product.address.long };
      let currentPosition = { lat: this.services.current_position.lat, lng: this.services.current_position.lng };
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(location.lat - currentPosition.lat);  // this.deg2rad below
      var dLon = this.deg2rad(location.lng - currentPosition.lng);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(currentPosition.lat)) * Math.cos(this.deg2rad(location.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d.toFixed(2);
    } else {
      return 0;
    }
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  ionViewDidLoad() {
    this.getproducts();
    console.log('ionViewDidLoad ProductsPage');
  }

  gotoDetails(product) {
    this.navCtrl.push('ProductDetailsPage', { product: product });
  }

  filterItems(ev: any) {
    let val = ev.target.value;
    this.filtred = this.products;
    if (val && val.trim() !== '') {
      this.filtred = this.filtred.filter(function (item) {
        return item.title.toLowerCase().includes(val.toLowerCase());
      });
    }
  }

  getdatfromdateBase(ev: any) {
    let val = ev.target.value;
    this.searchterm = val;
    if (val) {
      this.showspinner = true;
      this.products = [];
      this.filtred = [];
      this.services.getsearchAds(val, this.category).then((res: any) => {
        this.showspinner = false;
        setTimeout(() => {
          this.products = res;
          this.filtred = res;
        }, 0);
      })
    } else {
      this.page = 0;
      this.showspinner = false;
      this.getproducts();
    }
  }

  playAudio(currentProduct, index) {
    if (currentProduct.voice.length > 0) {
      const audio = new Audio(currentProduct.voice[0]);
      if (this.platform.is('ios')) {
        audio.preload = 'metadata'
        audio.onloadedmetadata = ()=> {
          this.audioPlay(audio, index)
        }
      }else {
        audio.onloadeddata = ()=> {
          this.audioPlay(audio, index)
        }
      }
    }
  }

  audioPlay(audio, index) {
    this.selected = index;
    audio.play();
    setTimeout(() => {
      audio.pause();
      this.selected = null;
    }, Math.trunc((audio.duration) * 1000) + 100);
  }

  favoris(product) {
    this.services.addfavories(product.id).then((res: any) => {
      console.log("Back From Favvoris ", res);
    }).catch((err: any) => {
      // this.services.fireError(err);
    })
  }
  getproducts() {
    if (this.category) {
      this.services.getProductsByCategory(this.category, this.page, false, this.filter).then((res: any) => {
        this.products = res;
        this.filtred = this.products;
        this.services.getCurrentLocation(true).then((pos: any) => {
          this.services.current_position.lat = pos.coords.latitude;
          this.services.current_position.lng = pos.coords.longitude;
          console.log("This is The Current Location Information : ", pos);
        }).catch(err => {
          console.log(err);
          // this.services.fireError(err);
        });
      }).catch(err => {
        console.log(err);
        // this.services.fireError(err);
      })
    } else {
      this.services.getAllProducts(this.page, false, this.filter).then((res: any) => {
        this.products = res;
        this.filtred = this.products;
        this.services.getCurrentLocation(true).then((pos: any) => {
          this.services.current_position.lat = pos.coords.latitude;
          this.services.current_position.lng = pos.coords.longitude;
          console.log("This is The Current Location Information : ", pos);
        }).catch(err => {
          console.log(err);
          // this.services.fireError(err);
        });
      }).catch(err => {
        console.log(err);
        // this.services.fireError(err);
      })
    }
  }
  doInfinite(infiniteScroll) {
    if (!this.searchterm) {
      this.doinfinity = infiniteScroll;
      this.page++;
      if (this.category) {
        this.services.getProductsByCategory(this.category, this.page, true, this.filter).then((res: any) => {
          res.forEach(element => {
            this.filtred.push(element);
          });
          setTimeout(() => {
            this.products = this.filtred;
          }, 10);
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
        }).catch(err => {
          console.log(err);
          // this.services.fireError(err);
          this.doinfinity.complete();
        })
      } else {
        this.services.getAllProducts(this.page, true, this.filter).then((res: any) => {
          res.forEach(element => {
            this.filtred.push(element);
          });
          setTimeout(() => {
            this.products = this.filtred;
          }, 10);
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
        }).catch(err => {
          console.log(err);
          // this.services.fireError(err);
          this.doinfinity.complete();
        })
      }
    }
  }
  openfilter() {
    if (this.services.current_position) {
      this.filter.lat = this.services.current_position.lat;
      this.filter.lng = this.services.current_position.lng;
    }
    let modal = this.modalCtrl.create('FiltersModalPage', { filter: this.filter }, { cssClass: 'filter-modal' });
    modal.present();
    modal.onDidDismiss(filter => {
      console.log(filter);
      if (filter) {
        console.log("This is the filter => ", filter);
        this.products = [];
        this.filtred = [];
        this.page = 1;
        setTimeout(() => {
          if (this.doinfinity)
            this.doinfinity.enable(true);
          this.getproducts();
        }, 10);
      }
    });
  }
}
