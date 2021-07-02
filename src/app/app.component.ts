import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { Platform, Nav, Events, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as $ from "jquery";
import { ApiServicesProvider } from '../providers/api-services/api-services';
import { Push, PushOptions, PushObject, NotificationEventResponse } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { CallNumber } from '@ionic-native/call-number';
import { Badge } from '@ionic-native/badge';
import { MediaObject } from '@ionic-native/media';
import { TranslateService } from '@ngx-translate/core';
import { StorageProvider } from '../providers/storage/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation';
import { PluginProvider } from '../providers/plugin-service/plugin-service';

import { BranchIo } from '@ionic-native/branch-io';
import { trigger, transition, query, animate, style, keyframes, stagger, state } from '@angular/animations';

@Component({
  templateUrl: 'app.html',
  animations: [
    trigger('pushNotifAnimation', [
      transition(':enter', [
        animate('.5s ease-in', keyframes([
          style({transform: 'translateY(-100%)', offset: 0}),
          style({transform: 'translateY(10px)', offset: .4}),
          style({transform: 'translateY(-5px)', offset: .7}),
          style({transform: 'translateY(0px)', offset: 1.0}),
        ]))
      ]),
      transition(':leave', [
        animate('.2s ease-out', keyframes([
          style({transform: 'translateY(0px)', offset: 0}),
          style({transform: 'translateY(-100%)', offset: 1.0}),
        ]))
      ])
    ])    
  ]
})
export class MyApp {
  rootPage: any = 'MapPage';
  @ViewChild('customCard') customCard: ElementRef;
  @ViewChild(Nav) nav: Nav;
  timeoutHandle = null;
  notifys: any = [];
  isinchat: boolean = false;
  currentToken: any;
  notify: any = {
    product: {}
  };
  discussion: any = null;
  profile: any = null;
  profile_id: any = null;
  showprofilecard: boolean = false;
  shownotify: boolean = false;
  showrow: boolean = false;
  audio: MediaObject;
  categories: any = []
  showPushNotification = false
  notifTimeout
  currentConversationId
  constructor(private platform: Platform, private zone: NgZone, statusBar: StatusBar,
    splashScreen: SplashScreen,
    private services: ApiServicesProvider,
    private push: Push,
    public modalCtrl: ModalController,
    private device: Device,
    public events: Events,
    private geolocation: Geolocation,
    private branch: BranchIo,
    private callNumber: CallNumber,
    private badge: Badge,
    private appConfig: AppConfigProvider,
    private translate: TranslateService,
    private storage: StorageProvider,
    private backgroundGeolocation: BackgroundGeolocation,
    private pluginProvider: PluginProvider
  ){
    events.subscribe('user_loggedIn', (user) => {
      if (this.platform.is('cordova')) {
        console.log('we Are inside Events now');
        setTimeout(() => {
          this.init_location();
        }, 500);
      }
    });

    this.events.subscribe('chatPage', id => this.currentConversationId = id)

    // events.subscribe('isinChat', () => {
    //   this.isinchat = true;
    //   console.log('isinchat : ', true);
    // })

    // events.subscribe('leaveChat', () => {
    //   console.log('isinchat 1: ', false);
    //   this.isinchat = false;
    // })

    let self = this;
    platform.ready().then(() => {
      this.initLang()
      let user = JSON.parse(localStorage.getItem("onatrouvé_user"));
      let tokens = JSON.parse(localStorage.getItem("onatrouvé_token"))

      console.log("User", user);
      console.log("tokens", tokens);

      // check GPS 
      //this.pluginProvider.checkGPSPermission();

      if (user && tokens) {
        this.currentToken = tokens.token;
        this.services.current_user = user;
        this.services.isLoggedIn = true;
        if (this.platform.is('cordova')) {
          setTimeout(() => {
            this.init_location();
          }, 500);
        }
      }

      const options: PushOptions = {
        android: {
          senderID: "586038491325",
          sound: true,
          vibrate: true,
          icon: "icon"
          // forceShow:true
        },
        ios: {
          alert: true,
          badge: true,
          sound: true,
        },
        windows: {}
      };
      const pushObject: PushObject = this.push.init(options);
      pushObject.on("registration").subscribe((registration: any) => {
        console.log(registration.registrationId);
        localStorage.setItem("com.onatrouve-regId", (registration.registrationId));
        let deviceData = {
          reg_id: registration.registrationId,
          os: this.device.platform
        };
        this.services.device_data = deviceData;
        localStorage.setItem('deviceData', JSON.stringify(deviceData));
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      pushObject.on("notification").subscribe((notification: NotificationEventResponse) => {
        console.log("Notification :  ", notification);
        console.log("Data Recieve From Notification Here : >> ", JSON.stringify(notification.additionalData));
        const { conversation, ischat, isproduct, foreground } = notification.additionalData
        if (ischat) {
          this.notify.product.title = notification.title;
          this.notify.target = 'ChatPage';
          this.notify.product.description = notification.message;
          this.notify.product.src = notification.image;
          this.notify.conversation = conversation
          this.zone.run(() => {
            this.notifys.push(this.notify);
          })
          // this.notify.discussion = notification.additionalData.discussion_id;
        }else if (isproduct) {
          this.services.getproductbyId(notification.additionalData.product_id, true).then((product: any) => {
            this.notify.product = product.json();
            if (product.json().person.id != this.services.current_user.id) {
              this.notify.target = 'ProductDetailsPage';
              this.notify.conversation = null;
              setTimeout(() => {
                this.zone.run(() => {
                  this.notifys.push(this.notify);
                })
              }, 10);
            } else {
              this.notify.target = "Profile";
              this.notify.profile_id = notification.additionalData.sender_id;
              setTimeout(() => {
                this.zone.run(() => {
                  this.notifys.push(this.notify);
                })
              }, 10);
            }
          }).catch(err => {
            console.log(err);
          })
        }

        console.log('foreground', foreground);
        if (foreground) {
          if (!ischat) {
            if (this.platform.is('ios')) {
              this.gotoTarget(this.notify);
            }else {
              this.showNotification()
            }
          } else if (ischat && (!this.currentConversationId || this.currentConversationId != conversation.id)) {
            if (this.platform.is('ios')) {
              this.gotoTarget(this.notify);
            }else {
              this.showNotification()
            }
          }
        } else {
          this.firebeep();
          setTimeout(() => {
            this.gotoTarget(this.notify);
          }, 500);
        }
      });

      pushObject.on("error").subscribe(error => console.error("Error with Push plugin", error));
      statusBar.backgroundColorByHexString('#67c1c2');
      splashScreen.hide();
      setTimeout(() => {
        this.branchInit();
      }, 5000);
    });

    this.platform.resume.subscribe(() => {
      this.branchInit();
    });

    $(document).on('click', '.tappeditems .label', function (e) {
      $(this).parent().parent().parent().siblings().slideToggle(120);
      e.preventDefault();
    });
    // $(document).ready(function () {
    //   // $("#subCategorylist").hide();
    //   $('#subCategoryBtn').on("click", function (event) {
    //     $("#subCategorylist").slideToggle(500);
    //     zone.run(() => {
    //       self.showrow = !self.showrow;
    //     });
    //     console.log(self.showrow);
    //   });
    // });
  }

  showNotification() {
    this.firebeep();
    if (this.notifTimeout) {
      window.clearTimeout(this.notifTimeout);
    }
    // this.receivedNotification = notification;
    this.zone.run(()=> {
      this.showPushNotification = true;
    });
    this.notifTimeout = setTimeout(() => {
      this.zone.run(()=> {
        this.showPushNotification = false;
        this.notifys = [];
      });
    }, 5000);
  }


  // Branch initialization
  branchInit() {
    // only on devices
    if (!this.platform.is("cordova")) {
      return;
    }
    this.branch.initSession().then(data => {
      console.log("Data >>>> Branch : : ", JSON.stringify(data.pooductId));
      if (data["+clicked_branch_link"]) {
        // read deep link data on click
        // alert("Deep Link Data: " + JSON.stringify(data));
        switch (data['$deeplink_path']) {
          case 'reset-password':
            this.nav.push("ChangePasswordPage", { token: data.token });
            break;
          case 'product-details': 
            this.showProductDetails(data.productId)
          break;
        }

      } else {
        console.log("Inside Else Here", data["+non_branch_link"]);
        if (data["+non_branch_link"] && data["+non_branch_link"].indexOf("reset")) {
          console.log("Inside Branche");
          let fullurl = data["+non_branch_link"];
          let reseToken = fullurl.substr(
            fullurl.lastIndexOf("/") + 1,
            fullurl.length
          );
          console.log("THIS IS THE TOKEN :::>>>> ", reseToken);
          setTimeout(() => {
            this.nav.push("ChangePasswordPage", { token: reseToken });
          }, 10);

        }
      }
    });
  }

  showProductDetails(pooductId) {
    this.services.getproductbyId(pooductId).then((product: any) => {
      this.nav.push('ProductDetailsPage', { product: product.json() });
    }).catch((err: any) => {
      console.log(err);
    })
  }

  closenotif() {
    this.showPushNotification = false
  }

  firebeep() {
    var audio3 = new Audio('assets/sounds/intuition.mp3');
    audio3.onloadeddata = function () {
      audio3.play();
    }
  }

  getcategorie() {
    $(document).ready(function () {
      $(".tappeditems").on("click", function (event) {
        alert("aaaa");
      });
    });
  }

  gotoTarget(notify) {
    console.log('Notify Target >>>>> ', JSON.stringify(notify))
    this.showPushNotification = false
    if (notify.target == "Profile" && notify.profile_id) {
      // Get User By ID Profile Is the id
      this.services.getuserByID(notify.profile_id).then((res: any) => {
        this.profile = res;
        setTimeout(() => {
          let modal = this.modalCtrl.create('CustomCardPage', { notify: notify, profile: this.profile }, { cssClass: 'filter-modal' });
          modal.present();
        }, 0);
      }).catch((error: any) => {
        console.log(error);
      });
    } else {
      const modal = this.modalCtrl.create(notify.target, { product: notify.product, conversation: notify.conversation, comefromnotif: true });
      modal.present()

    }
  }
  openLangModal() {
    let modal = this.modalCtrl.create('SettingsPage', {}, { cssClass: 'categories-modal' });
    modal.present();
    modal.onDidDismiss(params => {
      console.log("Console from LangModals");
    });
  }

  openCategoryModal(category) {
    console.log(category.subcategories);
    let modal = this.modalCtrl.create('SubCategoriesPage', { subcategories: category.subcategories }, { cssClass: 'categories-modal' });
    modal.present();
    modal.onDidDismiss(params => {
      if (params && params.link) {
        console.log("Console from Modals", params.link);
        this.gotoproducts(params.link.title);
      }

    });
  }

  gotoproductsfrommenue(subcategorie_title) {
    console.log("Tapped Product");
    this.gotoproducts(subcategorie_title);
  }


  openInfoModal() {
    let modal = this.modalCtrl.create('InfoPage');
    modal.present();
  }



  mes_Annonces() {
    this.nav.setRoot("MesAnnoncesPage");
  }
  // End background grolocation


  // *********************************************
  // sendGPS Method to send data to api locate 
  // start Methode
  // ************************************

  sendGPS(location) {
    this.services.sendGpsToApi(location, this.services.current_user.HasTarget.map(res => res.id)).then(data => {
      console.log("POST Request is successful ", data);
    })
      .catch(error => {
        console.log("Error when sending data to server Side");
        console.log(error);
      });
  }


  // End Method sendGps Here
  init_location() {

    console.info('Init location')
    console.log(this.currentToken)
    const bgGeolocationConfig: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 5,
      interval: 5000,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      stopOnStillActivity: false,
      startOnBoot: true,
      maxLocations: 500,
      // url: 'http://192.168.1.29:3003/geolocation',
      url: `${this.appConfig.API}/locate`,
      httpHeaders: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.currentToken}`,
        'Content-Type': 'application/json'
      },
      // customize post properties
      postTemplate: {
        latitude: '@latitude',
        longitude: '@longitude',
      }
    };

    this.backgroundGeolocation.configure(bgGeolocationConfig).then(async () => {
      console.log('First then')      
      this.backgroundGeolocation.on(BackgroundGeolocationEvents['location']).subscribe(async (location: BackgroundGeolocationResponse) => {

        const status = await this.backgroundGeolocation.checkStatus()
        //const config = await this.backgroundGeolocation.getConfig()              
        const config = await this.backgroundGeolocation.getConfig()
        console.log('config', config, status)        
        console.log('Inside location : ', location);
        // this.sendGPS(location);
      });
    });

    this.backgroundGeolocation.start();
  }

  stopBackgroundGeolocation() {
    // If you wish to turn OFF background-tracking, call the #stop method.
    this.backgroundGeolocation.stop();
  }

  dialCall() {
    console.log('callPerson', this.notify);
    let called = this.profile.phone.substr(1, this.profile.phone.length);;
    this.callNumber.callNumber("0033" + called, true)
      .then(res => {
        console.log('Launched dialer!', res);
        this.showprofilecard = false;
      })
      .catch(err => console.log('Error launching dialer', err));
  }
  // start_location(){
  // this.backgroundGeolocation.start();
  //   }
  cancel() {
    this.showprofilecard = false;
  }

  goto(link, params?) {

    this.nav.setRoot(link);

  }
  gotoproducts(category) {
    console.log("this is the Category : ", category);
    this.nav.push("ProductsPage", { category: category });
  }

  gotoHome() {
    this.nav.setRoot("MapPage");
  }

  logout() {
    this.services.logout().then((res: any) => {
      this.stopBackgroundGeolocation();
      this.services.isLoggedIn = false;
      localStorage.clear();
      setTimeout(() => {
        this.nav.setRoot("MapPage");
      }, 100);
    }).catch((err: any) => {
      this.services.fireError(err);
    });
  }

  async setBagdgePermission() {
    try {
      let hasPermission = await this.badge.hasPermission();
      if (!hasPermission) {
        let permission = await this.badge.requestPermission();
        console.log(permission);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async setbadge(badgeNumber: number) {
    try {
      let badges = await this.badge.set(badgeNumber);
      console.log(badges);
    } catch (e) {
      console.error(e);
    }
  }

  async getbadges() {
    try {
      let existingBadges = await this.badge.get();
      return existingBadges;
    } catch (e) {
      console.error(e);
    }
  }

  async clearBadges() {
    try {
      await this.badge.clear();
    } catch (error) {
      console.error(error);
    }
  }

  async increasebadges(badgeNumber: number) {
    try {
      let badges = await this.badge.increase(Number(badgeNumber));
      console.log(badges);
    } catch (e) {
      console.error(e);
    }
  }

  fireMethod({ method, params }) {
    this[method](params)
  }

  async decreasebadges(badgeNumber: number) {
    try {
      let badges = await this.badge.decrease(Number(badgeNumber));
      console.log(badges);
    } catch (e) {
      console.error(e);
    }
  }

  async changeLanguage(lang) {
    console.log(this.appConfig.userSettings);
    this.appConfig.userSettings.language = lang;
    console.log(this.appConfig.userSettings.language);
    console.log("UserSettinrg", this.appConfig.userSettings);
    await this.storage.set('userSettings', this.appConfig.userSettings);
    this.changeDirection();
  }

  async changeDirection() {
    let userSettings = await this.storage.get('userSettings');
    if (userSettings) {
      this.appConfig.userSettings = userSettings
    }
    if (this.appConfig.userSettings.language == 'ar') {
      this.platform.setDir('rtl', true);
    } else {
      this.platform.setDir('ltr', true);
    }
    console.log("UsedLanguage", this.appConfig.userSettings.language);
    this.translate.use(this.appConfig.userSettings.language);
    // this.events.publish('languageChange',true);
  }


  async initLang() {
    console.log('initLanguage');
    let userSettings = await this.storage.get('userSettings');
    this.translate.setDefaultLang('fr');
    if (userSettings && userSettings.language) {
      this.appConfig.userSettings = userSettings;
      console.log(userSettings.language);
      if (userSettings.language == 'ar') {
        this.platform.setDir('rtl', true);
      } else {
        this.platform.setDir('ltr', true);
      }
      console.log(userSettings.language);
      this.translate.use(userSettings.language);
    } else {
      this.platform.setDir('ltr', true);
      this.translate.use('fr');
    }
  }


    

}
