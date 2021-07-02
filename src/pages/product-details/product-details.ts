import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content, Platform } from 'ionic-angular';
import { ViewChild, ElementRef } from '@angular/core';
import { Slides } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { EmailComposer } from '@ionic-native/email-composer';
import { UiProvider } from '../../providers/ui/ui';
import { SocialSharing } from "@ionic-native/social-sharing";
import { AppConfigProvider } from '../../providers/app-config/app-config';

declare var google;

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})

export class ProductDetailsPage {
  @ViewChild('Slides') slides: Slides;
  @ViewChild('mainSlide') mainSlide: Slides;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild(Content) content: Content;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;
  current_product: any = {};
  show_confirm: boolean = false;
  showways: boolean = false;
  gettingLocation = false
  constructor(public navCtrl: NavController,
    private services: ApiServicesProvider,
    private zone: NgZone, public navParams: NavParams,
    private callNumber: CallNumber,
    private emailComposer: EmailComposer,
    private ui: UiProvider,
    private appConfig: AppConfigProvider,
    private platform: Platform,
    private socialSharing: SocialSharing,
    private modalCtrl: ModalController
  ){
    if (this.navParams.get('product')) {
      this.current_product = this.navParams.get('product');
      if (this.navParams.get('comefromnotif')) {
        this.show_confirm = true;
      }
      // this.services.checkfavories(this.current_product.id).then((res:any)=>{
      //   console.log("Favories  : ",res.isfavory);
      //   this.current_product.isfavory=res.isfavory;
      // });
    } else
      this.navCtrl.pop();
  }

  ionViewDidLoad() {
    if (this.services.isLoggedIn && this.services.current_user)
      this.checkfavory();
    this.services.addvisitors(this.current_product.id).then((res: any) => {
      this.current_product.visitor = res.visitors;
    });

    this.gettingLocation = true
    this.services.getCurrentLocation(true).then((res: any) => {
      this.gettingLocation = false
      this.services.current_position.lat = res.coords.latitude;
      this.services.current_position.lng = res.coords.longitude;
      console.log(this.services.current_position);
      this.loadMap();
      this.startNavigating();
    }).catch(err => {
      this.gettingLocation = false
      console.log("Position Error ", err);
    })
  }

  slideChanged(currentIndex) {
    this.mainSlide.slideTo((currentIndex + 1));
  }
  goto(link, product?) {
    if (this.services.isLoggedIn) {
      if (product.person.id != this.services.current_user.id) {
        const conversation = {
          receiver: product.person,
          product
        }
        this.navCtrl.push("ChatPage", { conversation });
      }else {
        this.navCtrl.push("DiscussionPage", { product });
      }
    }
    else {
      this.ui.confirmation("s'identifier ! ", "Identfiez Vous pour Consulter la Conversation").then(() => {
        this.navCtrl.push('LoginPage');
      });
    }
  }
  call() {
    if (!this.services.current_user.phone) {
      return false
    }
    this.callNumber.callNumber(this.services.current_user.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  convertedtoObject(start) {
    return Array(start).fill(1);
  }

  // MAPS Methodes

  loadMap() {

    let latLng = new google.maps.LatLng(parseFloat(this.current_product.address.lat), parseFloat(this.current_product.address.long));

    let mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }

  startNavigating() {

    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(this.map);
    directionsDisplay.setPanel(this.directionsPanel.nativeElement);
    directionsService.route({
      origin: { lat: parseFloat(this.services.current_position.lat), lng: parseFloat(this.services.current_position.lng) },
      destination: { lat: parseFloat(this.current_product.address.lat), lng: parseFloat(this.current_product.address.long) },
      travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {
      console.log(res);
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }

    });

  }
  sendEmail() {
    if (this.services.isLoggedIn) {
      this.emailComposer.isAvailable().then((available: boolean) => {
        if (!available)
          this.ui.toast('Email non Disponible')
      })

      let email = {
        to: this.current_product.person.email,
        subject: 'On a trouvé ',
        body: '<h6 style="padding:5px;border-radius:5px;border:1px solid #67c1c2;">' + this.current_product.title + '</h6>',
        isHtml: true
      };

      // Send a text message using default options
      this.emailComposer.open(email);
    } else {
      this.ui.confirmation("s'identifier ! ", "Identfiez Vous pour Consulter la Conversation").then(() => {
        this.navCtrl.push('LoginPage');
      });
    }
  }
  shareApp() {
    const Branch = window["Branch"];
    if (this.platform.is('cordova')) {
      this.ui.loading();
      let picture = null;
      if (this.current_product.arrayImages.length)
        picture = this.current_product.arrayImages[0];
      let properties: any = {
        canonicalIdentifier: new Date().getTime().toString(),
        canonicalUrl: `${this.appConfig.API}/product/${this.current_product.id}`,
        title: this.current_product.title,
        contentDescription: this.current_product.description,
        contentImageUrl: picture,
        $deeplink_path: 'product-details',
        contentMetadata: {
          pooductId: this.current_product.id,
        }
      }

      if (this.platform.is('android')) {
        let extrasProperties = {
          $og_title: this.current_product.title,
          $og_description: this.current_product.description,
          $og_image_url: picture,
          $uri_redirect_mode: 1,
          $twitter_title: this.current_product.title,
          $twitter_description: this.current_product.description,
          $twitter_image_url: picture
        }
        properties = {
          ...properties,
          ...extrasProperties
        }
      }

      // create a branchUniversalObj variable to reference with other Branch methods
      let branchUniversalObj = null
      Branch.createBranchUniversalObject(properties).then((res) => {
        branchUniversalObj = res
        console.log('Response: ' + JSON.stringify(res))
        // optional fields
        let analytics = {}
        branchUniversalObj.generateShortUrl(analytics, properties).then((res) => {
          console.log('Response: ' + JSON.stringify(res.url))
          // branchUniversalObj.showShareSheet(analytics, properties, 'this is branch message')
          this.ui.unLoading();
          this.ui.shareType().then((shareType) => {
            this.ui.loading();
            if (shareType == 'fb') {
              this.socialSharing.shareViaFacebook(this.current_product.description, null, res.url).then((resp) => {
                this.ui.unLoading();
              }).catch(err => {
                this.ui.unLoading();
                console.log(err)
              });
            } else if (shareType == 'twitter') {
              this.socialSharing.shareViaTwitter(this.current_product.description, null, res.url).then((resp) => {
                this.ui.unLoading();
              }).catch(err => {
                this.ui.unLoading();
                console.log(err)
              });
            } else {
              this.socialSharing.share(this.current_product.description, this.current_product.title, picture, res.url)
                .then((resp) => {
                  this.ui.unLoading();
                }).catch(err => {

                  this.ui.unLoading();
                  console.log(err)
                });
            }// endif shareType
          })// shareType Promise
        }).catch((err) => {

          this.ui.unLoading();
          console.log('Error: ' + JSON.stringify(err))
        });
      }).catch((err) => {
        this.ui.unLoading();
        console.log('Error: ' + JSON.stringify(err))
      });
    }

    // this.ui.loading();
    // this.socialSharing
    //   .share(
    //     this.current_product.title,
    //     this.current_product.decription,
    //     this.current_product.arrayImages[0],
    //     this.current_product.arrayImages[0]
    //   )
    //   .then(() => {
    //     this.ui.unLoading();
    //   })
    //   .catch(() => {
    //     this.ui.unLoading();
    //   });
  }

  scrollToBottom(duration?: number) {
    this.showways = !this.showways;
    if (this.showways) {
      setTimeout(() => {
        if (this.content) {
          this.content.scrollToBottom(duration);
        }
      }, 200)
    }
  }

  addFavories() {
    if (this.services.isLoggedIn) {
      this.services.addfavories(this.current_product.id).then((res: any) => {
        console.log(res.favory.isfavory);
        this.current_product.isfavory = res.favory.isfavory;
        console.log(this.current_product);
        if (res.favory.isfavory)
          this.ui.toast("Cette annonce est dans votre liste de favoris");
        else
          this.ui.toast("Cette annonce n’est plus dans votre liste de favoris");
      }).catch((err) => {
        this.services.fireError(err);
      });
    }
    else {
      this.ui.confirmation("Identifier ! ", "Vous devez vous identifier").then(() => {
        this.navCtrl.push('LoginPage');
      });
    }
  }
  dialCall() {
    if (this.services.isLoggedIn) {
      if (this.current_product.person.phone) {
        console.log(this.current_product.person.phone, 'callPerson');
        let called = this.current_product.person.phone.substr(1, this.current_product.person.phone.length);;
        this.callNumber.callNumber("0033" + called, true)
          .then(res => console.log('Launched dialer!', res))
          .catch(err => console.log('Error launching dialer', err));
      }
    } else {
      this.ui.confirmation("Identifier ! ", "Vous devez vous identifier").then(() => {
        this.navCtrl.push('LoginPage');
      });
    }

  }
  openRateModal() {
    let mapModal = this.modalCtrl.create("RatingPage", { providerRate: this.current_product.rate }, { cssClass: 'Rating-modal' });
    mapModal.onDidDismiss(params => {
      if (params) {
        console.log(params);
        // this.current_product.rate=params;
        this.services.addrates(this.current_product.id, params).then((res: any) => {
          console.log("This is The Server Responces ", res);

          this.current_product.rate = res.rate.rates;
        }).catch((err) => {

        })
      }
      else
        console.log("No Data");
    });
    mapModal.present();

  }
  thisIstheProduct() {
    console.log('this is The product');
    this.services.deletesuivi(this.current_product.id).then((res: any) => {
      console.log(res);
      // this.ui.toast("On a Trouvé : "+this.current_product.title+" !!! " ,null,null,null,'top');
      this.show_confirm = false;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  checkfavory() {
    this.services.checkFavory(this.current_product.id).then((res: any) => {
      console.log("This is a Log From FavoriesPage", res);
      console.log(res);
      this.current_product.isfavory = res.isfavory;
    }).catch(err => {
      console.log(err);
      this.services.fireError(err);
    })
  }
}
