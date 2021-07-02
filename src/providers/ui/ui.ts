import { Injectable } from '@angular/core';
import {
  LoadingController,
  ToastController,
  AlertController,
  ModalController,
  ActionSheetController,
  PopoverController,
  Events,
  Loading
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraProvider } from '../camera/camera';

@Injectable()
export class UiProvider {
  private loaders: Loading[] = [];
  constructor(public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private actionCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    public events: Events,
    private sanitizer: DomSanitizer,
    public translate: TranslateService,
    private camera: CameraProvider) {
  }

  alert(title, message,) {
    return new Promise((resolve, reject) => {
      this.translate.get([title, message, 'modals.ok']).subscribe(values => {
        let alert = this.alertCtrl.create({
          title: values[title],
          subTitle: values[message],
          buttons: [
            {
              text: values['modals.ok'],
              handler: () => {
                resolve(true);
              }
            }
          ]
        });
        alert.present();
      });
    });
  }

  alertImage(title, message,) {
    return new Promise((resolve, reject) => {
      this.translate.get([title, message, 'modals.ok', 'service.addPicture', 'service.getPhoto']).subscribe(values => {
        let alert = this.alertCtrl.create({
          title: values[title],
          subTitle: values[message],
          buttons: [
            {
              text: values['service.addPicture'],
              handler: () => {
                resolve(1);
              }
            },
            {
              text: values['service.getPhoto'],
              handler: () => {
                resolve(2);
              }
            }
          ]
        });
        alert.present();
      });
    });
  }

  promptAlert(title, message?) {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: title,
        inputs: [
          {
            name: 'content',
            placeholder: 'your comment ...'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
            }
          },
          {
            text: 'Save',
            handler: data => {
              resolve(data);
            }
          }
        ]
      });
      alert.present();

    });
  }

  customLoader(): any {
    let html = `<div id="loader">
    <div id="shadow"></div>
    <div id="box"></div>
  </div>`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  createLoder(message?) {
    let load = this.loadingCtrl.create({
      spinner: 'hide',
      cssClass: 'customLoader',
      content: this.customLoader()
    });
    load.present();
    this.loaders.push(load);
  }

  loading(content?) {
    if (!content)
      this.createLoder();
    else {
      this.createLoder(content);
    }
  }
  unLoading() {
    // if (this.load)
    //   this.load.dismissAll();
    this.loaders.forEach((loader, index) => {
      if (loader) {
        this.loaders[index].dismiss();
        this.loaders.splice(index, 1);
      }
    });
  }

  toast(message, cssClass?, params?, duration?, position?) {

    if (!params)
      params = '';
    let toastInst = this.toastCtrl.create({
      message: message + params,
      cssClass: cssClass || '',
      position: position || 'bottom',
      duration: duration || 2000
    });
    toastInst.present();

  }

  confirmation(title, message, yesBtn?, noBtn?) {
    let agreeBtn = yesBtn || 'Oui';
    let disagreeBtn = noBtn || 'Non';
    return new Promise((resolve, reject) => {

      let confirm = this.alertCtrl.create({
        title: title,
        message: message,
        buttons: [
          {
            text: agreeBtn,
            handler: () => {
              resolve(true);
              console.log('Agree clicked');
            }
          },
          {
            text: disagreeBtn,
            handler: () => {
              reject(false);
              console.log('Disagree clicked');
            }
          }
        ]
      });
      confirm.present();
    })
  }

  confirmationWithReject(title, message, yesBtn?, noBtn?) {
    let agreeBtn = yesBtn || 'modals.ok';
    let disagreeBtn = noBtn || 'modals.cancel';
    return new Promise((resolve, reject) => {
      this.translate.get([title, message, agreeBtn, disagreeBtn]).subscribe(values => {
        let confirm = this.alertCtrl.create({
          title: values[title],
          message: values[message],
          buttons: [
            {
              text: values[agreeBtn],
              handler: () => {
                resolve('Agree clicked');
              }
            },
            {
              text: values[disagreeBtn],
              handler: () => {
                reject('Disagree clicked');
              }
            }
          ]
        });
        confirm.present();
      })
    });
  }

  rating(title, message, yesBtn?, noBtn?) {
    let agreeBtn = yesBtn || 'modals.ok';
    let disagreeBtn = noBtn || 'modals.cancel';
    return new Promise((resolve, reject) => {
      this.translate.get([title, message, agreeBtn, disagreeBtn]).subscribe(values => {
        let confirm = this.alertCtrl.create({
          title: values[title],
          message: values[message],
          buttons: [
            {
              text: values[agreeBtn],
              handler: () => {
                resolve(true);
                console.log('Agree clicked');
              }
            },
            {
              text: values[disagreeBtn],
              handler: () => {
                console.log('Disagree clicked');
              }
            }
          ]
        });
        confirm.present();
      })
    });
  }

  imageType() {
    return new Promise((resolve, reject) => {
      let action = this.actionCtrl.create({
        title: "Ajouter Les Images d'Annonce",
        buttons: [
          {
            text: "Appareil Photo",
            icon: 'camera',
            handler: () => {
              this.camera.fromCamera().then(base64 => resolve(base64));
            }
          }, {
            text: "Chercher Photo",
            icon: 'images',
            handler: () => {
              this.camera.fromGalley().then(base64 => resolve(base64));
            }
          }, {
            text: "Fermer",
            icon: 'close',
            role: 'cancel',
            handler: () => {
              // reject('cancel');
              console.log('Cancel clicked');
            }
          }
        ]
      });
      action.present();

    });
  }


  postType() {
    return new Promise((resolve) => {
      this.translate.get(['modals.ok', 'modals.cancel', 'addLost.title', 'addFound.title']).subscribe(values => {
        let action = this.actionCtrl.create({
          //title: 'Take photo from',
          buttons: [
            {
              text: values['addLost.title'],
              handler: () => {
                resolve('title_lost');
              }
            }, {
              text: values['addFound.title'],
              handler: () => {
                resolve('title_found');
              }
            }, {
              text: values['modals.cancel'],
              icon: 'close',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        action.present();
      });
    });
  }

  privacy() {
    this.translate.get(['modals.ok', 'modals.cancel', 'modals.openPrivacy', 'settings.term']).subscribe(values => {
      let action = this.actionCtrl.create({
        title: values['modals.openPrivacy'],
        buttons: [
          {
            text: '<a href="http://peppepcar.com/privacy" target="_system">' + values['settings.term'] + '</a>',
            //icon: 'camera',
            handler: () => {
              console.log('Open website');
            }
          }, {
            text: values['modals.cancel'],
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      action.present();
    });
  }
  shareType() {
    return new Promise((resolve) => {
      this.translate.get(['modals.ok', 'modals.cancel', 'detailsPage.fabs.shareTitle', 'detailsPage.fabs.shareFb', 'detailsPage.fabs.shareTwitter', 'detailsPage.fabs.shareOther']).subscribe(values => {
        let action = this.actionCtrl.create({
          title: "Partager l'annonce",
          buttons: [
            {
              text: 'Partage Via Fb',
              icon: 'logo-facebook',
              handler: () => {
                resolve('fb');
              }
            }, {
              text: 'Partage Via Twitter',
              icon: 'logo-twitter',
              handler: () => {
                resolve('twitter');
              }
            }, {
              text: 'Autre Outils de Partage',
              icon: 'md-share',
              handler: () => {
                resolve('others');
              }
            }
          ]
        });
        action.present();
      });
    });
  }

  commentOptions() {
    return new Promise((resolve, reject) => {
      this.translate.get(['modals.edit', 'modals.del', 'comment.title']).subscribe(values => {
        let action = this.actionCtrl.create({
          title: values['comment.title'],
          buttons: [
            {
              text: values['modals.edit'],
              //icon: 'camera',
              handler: () => {
                resolve('edit');
                console.log('edit clicked');
              }
            }, {
              text: values['modals.del'],
              //icon: 'close',
              //role: 'cancel',
              handler: () => {
                resolve('del');
                console.log('delete clicked');
              }
            }
          ]
        });
        action.present();
      });
    });
  }

  phoneNumbers(phone, secondPhone) {
    return new Promise((resolve, reject) => {
      this.translate.get(['detailsPage.selectNumber']).subscribe(values => {
        let action = this.actionCtrl.create({
          title: values['comment.title'],
          buttons: [
            {
              text: phone,
              //icon: 'camera',
              handler: () => {
                resolve(phone);
                console.log('phone clicked');
              }
            }, {
              text: secondPhone,
              //icon: 'close',
              //role: 'cancel',
              handler: () => {
                resolve(secondPhone);
                console.log('secondPhone clicked');
              }
            }
          ]
        });
        action.present();
      });
    });
  }

  modal(page: any, data?: any, opts?: any) {
    let modalInst = this.modalCtrl.create(page, data, opts);
    modalInst.present();
    return modalInst;
  }

  popover(component: any, event: any, data?: any, opts?: any) {
    let popover = this.popoverCtrl.create(component, data);
    popover.present({
      ev: event
    });
    return popover
  }

  fireError(err?, msg: string = 'Connexion Error') {
    console.log(err);
    this.unLoading();
    this.toast(msg, 'error');
  }

  fireSuccess(message: string, duration = 3500) {
    this.toast(message, 'success', null, duration);
  }

  confirmationPrompt(title, message, inputName?, inputPrice?, yesBtn?, noBtn?) {
    let agreeBtn = yesBtn || 'modals.yes';
    let disagreeBtn = noBtn || 'modals.no';
    return new Promise((resolve, reject) => {
      this.translate.get([title, message, inputName, inputPrice, agreeBtn, disagreeBtn]).subscribe(values => {
        let confirm = this.alertCtrl.create({
          title: values[title],
          message: values[message],
          inputs: [
            {
              name: 'missionname',
              placeholder: values[inputPrice],
              type: 'text',
            },
            {
              name: 'price',
              placeholder: values[inputName],
              type: 'number',


            },

          ],
          buttons: [
            {
              text: values[agreeBtn],
              handler: (data) => {
                resolve(data);
                console.log('Agree clicked');
              }
            },
            {
              text: values[disagreeBtn],
              handler: () => {
                reject(false);
                console.log('Disagree clicked');
              }
            }
          ]
        });
        confirm.present();
      })
    });
  }


}