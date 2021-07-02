import { Component, NgZone } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { UiProvider } from '../../providers/ui/ui';

@IonicPage()
@Component({
  selector: 'page-suivi',
  templateUrl: 'suivi.html',
})
export class SuiviPage {
  private color: any;
  private selectedC: any = {};
  private subcategories: any = [];
  private selectedSub: any = {};
  private suivi: any = {
    locate: true,
  };

  private propertyModel: any = {
    min: {},
    max: {}
  };
  private metre: any;
  private submit: boolean = false;
  private selectedProperties: any = [];
  private FindProduct: any = {};
  private selectedCategory: any = {};
  private meter: any;
  private price_min: number;
  private price_max: number;
  private structure: any = { lower: 33, upper: 60 };
  private categorys: any = [];
  constructor(public navCtrl: NavController,
    private services: ApiServicesProvider,
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private ui: UiProvider) {
    this.initializeFrom();
  }


  loadSubcategories() {
    //   if(this.selectedC.title!="EMPLOI"){
    //     this.FindProduct.addControl('price_min', new FormControl('', Validators.required));
    //     this.FindProduct.addControl('price_max', new FormControl('', Validators.required));
    //   }
    //   else{
    //   this.FindProduct.removeControl('price_min');
    //   this.FindProduct.removeControl('price_max');

    // }
    this.FindProduct.controls['subcategory'].reset();
    this.suivi.selectedCategory = null;
    setTimeout(() => {
      this.subcategories = this.selectedC.subcategories
      console.log("This is The loaded  :", this.subcategories);
    }, 10);

  }

  loadproperties(subcategory) {
    this.suivi.selectedCategory = subcategory.id
    console.log("this  is the subcategories", subcategory)
    setTimeout(() => {
      this.selectedSub = subcategory;
      console.log(this.selectedSub);
    }, 100);
    if (subcategory.has_price) {
      this.FindProduct.addControl('price_min', new FormControl('', Validators.required));
      this.FindProduct.addControl('price_max', new FormControl('', Validators.required));
    }
    else {
      this.FindProduct.removeControl('price_min');
      this.FindProduct.removeControl('price_max');

    }
    //   this.services.getProperties(this.suivi.selectedCategory).then((res:any)=>{
    //     console.log("Recieved Properties : ",res.properties);
    //     this.zone.run(() => {
    //       this.clearfoms().then(()=>{
    //         this.propertyModel={
    //           min:{},
    //           max:{}
    //         };
    //         this.selectedProperties=res.properties;
    //         console.log(this.selectedProperties);
    //         this.refactureFroms(res.properties);
    //       });
    //     });

    //   }).catch((error:any)=>{

    //   });


  }
  clearfoms() {
    return new Promise((resolve, reject) => {
      this.selectedProperties.forEach(property => {
        this.FindProduct.removeControl(property.key);
      });
      resolve(true);
    })
  }
  refactureFroms(properties) {
    console.log("this is  The Properties : ", properties);
    return new Promise((resolve, reject) => {
      properties.forEach(property => {
        if (property.required)
          this.FindProduct.addControl(property.key, new FormControl('', Validators.required));
        else
          this.FindProduct.addControl(property.key, new FormControl(''));
      });
      resolve(true);
    })
  }

  initializeFrom() {
    this.FindProduct = this.formBuilder.group({
      "title": ["", Validators.compose([Validators.required])],
      "category": ["", Validators.compose([Validators.required])],
      "subcategory": ["", Validators.compose([Validators.required])],
      "locate": [""],
      "range": [""],
      // "price_min":['',Validators.compose([Validators.min(0), Validators.max(999999999)])],
      // "price_max":['',Validators.compose([Validators.min(0), Validators.max(999999999)])],
    });
    // this.metre = Array(100).fill(0).map((x, i) => { if (i > 0) return (i * 5) - 1; else return (i * 5); });
    this.metre = [2, 5, 10, 20, 30, 40, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuiviPage');
    this.ui.loading();
    this.services.getCategories().then((res: any) => {
      console.log(res);
      this.categorys = res;

      this.ui.unLoading();
    }).catch((err: any) => {
      this.ui.unLoading();
      this.services.fireError(err);
    });

    this.getCurrentPosition()
  }

  getCurrentPosition() {
    this.services.getCurrentLocation(true).then((res: any) => {
      this.services.current_position.lat = res.coords.latitude;
      this.services.current_position.lng = res.coords.longitude;
      console.log("Current Position :", this.services.current_position);
    }).catch(err => {
      console.log("Position Error ", err);
    })
  }

  changeIcon() {

  }
  onChange(ev: any) {
    console.log('Changed', ev);
  }

  async suiviAnnonce() {
    this.submit = true;
    if (this.FindProduct.valid) {
      this.suivi.properties_search = this.propertyModel;
      if (this.suivi.locate) {
        await this.localiser();
        this.locateOnServer()
      }else {
        this.locateOnServer()
      }      
    }
  }

  locateOnServer() {
    this.services.suiviAnnonce(this.suivi).then((res: any) => {
      this.submit = false;
      if (res.product) {
        this.ui.toast("On a Trouvé", null, null, 2000, 'top');
        this.navCtrl.push('ProductDetailsPage', { product: res.product });
      } else if (!res.product) {
        this.ui.toast("Votre commande sera suivie", null, null, 2000, 'top');
      }
    }).catch((err: any) => {
      this.services.fireError(err);
    });
  }

  async localiser() {
    return new Promise((resolve, reject) => {
      this.ui.confirmation('Localiser le lieu', 'Voulez-vous déterminer votre emplacement automatiquement?').then(async(res: any) => {
        await this.getCurrentPosition()
        if (this.services.current_position.lat && this.services.current_position.lng) {
          this.suivi.lat = this.services.current_position.lat;
          this.suivi.lng = this.services.current_position.lng;
          console.log('CurrentPosition : : : :', this.services.current_position);
          resolve(true);
        }
      }).catch(err => {
        this.showMap().then((params: any) => {
          this.suivi.lng = params.long.toString();
          this.suivi.lat = params.lat.toString();
          console.log("FROm MAP", this.suivi)
          resolve(true);
        }).catch(err => {
          reject(false);
        });
        console.log('no');
      });
    });
  }
  async showMap() {
    return new Promise((resolve, reject) => {
      let mapModal = this.modalCtrl.create("MapPikkerPage");
      mapModal.onDidDismiss(params => {
        console.log(params);
        if (params) {
          this.suivi.lng = params.long.toString();
          this.suivi.lat = params.lat.toString();
          console.log("SuiviLatLng:::", this.suivi);
          resolve(params);
        } else {
          reject(false);
        }
      });
      mapModal.present();
    })
  }
  getDistanceFromLatLonInKm(product) {
    return new Promise((resolve, reject) => {
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
        resolve(d.toFixed(2));
      } else {
        reject(0);
      }
    });
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
}
