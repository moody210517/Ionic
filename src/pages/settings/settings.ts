import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, Platform, Events, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigProvider } from '../../providers/app-config/app-config';
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  userSettings: any = {
    language:this.appConfig.userSettings.language,

  };
  user: any = {};
  constructor(private translate: TranslateService,
              private platform: Platform,
              private appConfig: AppConfigProvider,
              private events: Events,
              private storage: StorageProvider,
              private zone:NgZone
            ) 
  {
    console.log(this.userSettings.language=this.appConfig.userSettings.language);
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
    console.log("UsedLanguage",this.appConfig.userSettings.language);
    this.translate.use(this.appConfig.userSettings.language);
    console.log(this.translate);
    this.events.publish('languageChange',true);
  }

  
  async changeLanguage(lang) {
    console.log(this.appConfig.userSettings);
    this.zone.run(()=>{
      this.appConfig.userSettings.language=lang;
      console.log(this.appConfig.userSettings.language);
    })
    console.log("UserSettinrg" ,this.appConfig.userSettings);
    await this.storage.set('userSettings',this.appConfig.userSettings);
    this.changeDirection();
  }

ionViewDidLeave(){
    this.storage.set('userSettings',this.userSettings);
  }
}

