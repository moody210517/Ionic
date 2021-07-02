import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigProvider {
  public appPrefix = "onatrouve";
  public appPrefixes = {
    app: 'onatrouve',
    settings: 'userSettings',
    user: 'currentUser',
    token: 'token',
    deviceId: 'deviceId'
  };
  private localUrl = 'dev.trouve.192.168.1.48.xip.io';
  private prodUrl = 'vps-6496d4c1.vps.ovh.net';
  public currentUrl = this.prodUrl
  private CONFIG: any = {
    apiUrl: `http://${this.currentUrl}/api`,
    baseAPI: `http://${this.currentUrl}`,
  }
  
  public API = this.CONFIG.apiUrl;
  public BASE_API = this.CONFIG.baseAPI;
  public CHAT_URL = this.CONFIG.chatUrl;
  public userSettings = { language: null, country: null };
  constructor() {
    this.userSettings.language = 'fr';
  }

  public getTwoCharLang() {
    return navigator.language ? navigator.language.substr(0, 2) : 'fr';
  }

  async getLang() {
    return this.userSettings.language;
  }

}