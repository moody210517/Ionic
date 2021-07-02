import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { UiProvider } from '../../providers/ui/ui';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { File } from '@ionic-native/file';
import { Media, MediaObject } from '@ionic-native/media';
import { AppConfigProvider } from '../../providers/app-config/app-config';

@IonicPage()
@Component({
  selector: 'page-add-products',
  templateUrl: 'add-products.html',
})
export class AddProductsPage {
  @ViewChild(Slides) slides: Slides;
  private updatedCat_ID: any;
  private updatedCat_subCat: any;
  private add_procuct: boolean = false;
  private startRecord: boolean = false;
  private AddProducts: any = {};
  private selectedProperties: any = [];
  private audiopath: any = null;
  private selectedRegion: any;
  private showplay:any='empty';
  private selectedCategory: any;
  private product: any = {
    address:
    {
      address: null,
      lat: 45.087890625,
      long: 2.321167252957821
    }
  };
  private arrayImages: any = [];
  private subcategories: any = [];
  private filePath: string;
  private fileName: string;
  private audio: MediaObject;
  private hasRecord: boolean = false;
  private isplaying: any = false;
  private audioDuration: any = null;
  private go: boolean = false;
  private myDate: any;
  private categorys: any = [];
  private regions: any = [];
  private selectedC: any = [];
  private propertyModel: any = {};

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    private ui: UiProvider,
    private media: Media,
    private zone: NgZone,
    private services: ApiServicesProvider,
    public modalCtrl: ModalController,
    private file: File,
    public platform: Platform,
    private appconfig:AppConfigProvider
  ) {
    this.initializeFrom();
  }


  loadSubcategories() {
    if (this.selectedC.title != "EMPLOI")
      this.AddProducts.addControl('price', new FormControl('', Validators.required));
    else
      this.AddProducts.removeControl('price');

    console.log(this.AddProducts.controls)
    this.subcategories = this.selectedC.subcategories
    console.log("Selected Subs ", this.selectedC);
  }


  loadproperties() {
    console.log("Selected Category", this.selectedCategory);
    this.services.getProperties(this.selectedCategory).then((res: any) => {
      console.log("Recieved Properties : ", res.properties);
      this.zone.run(() => {
        this.clearfoms().then(() => {
          this.selectedProperties = res.properties;
          this.refactureFroms(res.properties);
        });
        console.log(this.selectedProperties);
      });
    }).catch((error: any) => {
      this.ui.fireError(error);
    });
  }
  clearfoms() {
    return new Promise((resolve, reject) => {
      this.selectedProperties.forEach(property => {
        this.AddProducts.removeControl(property.key);
      });
      resolve(true);
    })
  }
  refactureFroms(properties) {
    return new Promise((resolve, reject) => {
      properties.forEach(property => {
        if (property.required)
          this.AddProducts.addControl(property.key, new FormControl('', Validators.required));
        else
          this.AddProducts.addControl(property.key, new FormControl(''));
      });
      resolve(true);
    })
  }

  initializeFrom() {
    this.AddProducts = this.formBuilder.group({
      "description": ["", Validators.compose([Validators.required, Validators.minLength(10)])],
      "title": ["", Validators.compose([Validators.required])],
      "price": ["", Validators.compose([Validators.required])],
      "address": ["", Validators.compose([Validators.required])],
      "category": ["", Validators.compose([Validators.required])],
      "subcategory": ["", Validators.compose([Validators.required])],
      // "region":["", Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.services.getCategories().then(res => {
      console.log(res);
      this.categorys = res;
      let modif = this.navParams.get("modify");
      if (modif) {
        this.product = this.navParams.get("product_to_edit");
        this.arrayImages = this.product.arrayImages;
        setTimeout(() => {
          this.zone.run(() => {
            // this.updatedCat_ID=this.product.subcategory.category.id;
            this.selectedC = this.product.subcategory.category;
            let category = this.categorys.filter(x => x.id === this.product.subcategory.category.id);
            console.log(">>>", category[0][0]);
            this.subcategories = category[0].subcategories;
            // console.log(this.updatedCat_ID);
            setTimeout(() => {
              if (this.selectedC.title != "EMPLOI")
                this.AddProducts.addControl('price', new FormControl('', Validators.required));
              else
                this.AddProducts.removeControl('price');

              this.selectedCategory = this.product.subcategory.id;
              this.loadproperties();
            }, 5);
          })
        }, 10);

        console.log(this.product);
      }
    }).catch(err => {
      this.ui.toast("Erreur : Chargement des Categories")
    })

    this.services.getRegions().then(res => {
      console.log(res);
      this.regions = res;
    }).catch(err => {
      this.ui.toast("Erreur : Chargement des regions")
    })
    console.log('ionViewDidLoad AddProductsPage');
  }


  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  pictureType() {
    this.ui.imageType().then(base64Image => {
      this.arrayImages.push(base64Image);
    });
  }

  showMap() {
    if (this.audio && this.fileName) {
      this.audio.stop();
    }
    let mapModal = this.modalCtrl.create("MapPikkerPage", { product: this.product });
    mapModal.onDidDismiss(params => {
      if (params) {
        let address = {
          address: params.address.toString(),
          long: params.long.toString(),
          lat: params.lat.toString()
        }

        this.product.address = address;
        console.log(this.product.address);
      }
    });
    mapModal.present();
  }

  pikkerDate(property_id) {
    this.propertyModel[property_id] = (new Date(this.myDate)).getTime();
    console.log(this.propertyModel[property_id]);
  }

  deleteImage(img, index) {
    let currentIndex = index;
    if (img.id) {
      this.arrayImages.splice(currentIndex, 1);
    } else {
      this.arrayImages.splice(currentIndex, 1);
      this.slides.slidePrev(0);

    }
  }

  sendingData() {
    console.log("This the Properties Content ", this.propertyModel);
    this.add_procuct = true;
    console.log(this.AddProducts);
    console.log(this.AddProducts.valid);
    if (this.AddProducts.valid && this.arrayImages.length > 0) {
      this.product.galleries = this.arrayImages;
      this.product.propertyAnswer = this.propertyModel;
      this.product.userid = this.services.current_user.id; // Must be Current User from auth
      this.product.subcategoryid = this.selectedCategory;//Must Be from Select from API Data
      this.product.categoryid = this.selectedC;//Must Be from Select from API Data
      this.product.regionid = this.selectedRegion;//Methode to get Region from Lat Long Required
      console.log("this is the Product");
      if (this.filePath)
        this.services.addFullProduct(this.product, this.filePath).then(res => { this.navCtrl.push('MesAnnoncesPage'); });
      else
        this.services.addFullProduct(this.product).then(res => { this.navCtrl.push('MesAnnoncesPage'); });
    }
  }


  startAudioRecorde() {
    if (this.platform.is('ios')) {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.mp3';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.mp3';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    }
    setTimeout(() => {
      this.startRecord = true;
      this.audio.startRecord();
    }, 100);
  }

  showAndPlay() {
    this.stopAudio().then(() => {
      this.hasRecord = true;
      this.showplayer();
    });
  }

  showplayer() {
    console.log('showPlay');
    this.showplay=true;
  }

  stopAudio() {
    return new Promise((resolve, reject) => {
      if (this.audio) {
        try {
          this.audio.stopRecord();
          this.startRecord = false;
          resolve(true);
        } catch (e) {
          this.startRecord = false;
          reject(false);
        }
      } else {
        this.startRecord = false;
        reject(false);
      }
    })
  }

  playAudio() {
    console.log('playAudio');
     this.audio = this.media.create(this.filePath);
    setTimeout(() => {
      this.audio.play();
      this.isplaying=true;
      setTimeout(() => {
        let duration=Math.floor(this.audio.getDuration());
        setTimeout(() => {
          this.isplaying=false;
        }, (duration*1000)+200);
      }, 200);
    
    }, 100);
  }


 pauseAudio() {
  console.log('pauseAudio');
     this.isplaying=false;
     this.audio.stop();
 }
}
