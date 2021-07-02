//import
import { UiProvider } from '../ui/ui';
import { Injectable, ViewChild } from '@angular/core';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { StorageProvider } from '../storage/storage';
import { HttpHelperProvider } from '../http-helper/http-helper';
import { AppConfigProvider } from '../app-config/app-config';
import { Device } from '@ionic-native/device';

@Injectable()
export class AuthServiceProvider {
  public user: any = null;
  public role = null;
  public isAuthenticated = false;
  public authToken: string;
  public API = this.appConfig.API;
  public BaseAPI = this.appConfig.BASE_API;
  deviceId: string
  deviceIdPrefix = this.appConfig.appPrefixes.deviceId
  currentUserPrefix = this.appConfig.appPrefixes.user
  tokenPrefix = this.appConfig.appPrefixes.token
  constructor(private httpHelper: HttpHelperProvider, 
              private appConfig: AppConfigProvider, 
              public UI: UiProvider,
              private events: Events,
              private device: Device,
              private storage: StorageProvider) 
  {
    // this.appConfig.translate.onLangChange.subscribe((event)=> {
    //   if (this.isAuthenticated) {
    //     this.setSettings({language: event.lang})
    //   }
    // })
    this.loadUserCredentials();
  }

  public loadUserCredentials() {
    return new Promise(async (resolve) => {
      let token = await this.storage.get(this.tokenPrefix);
      let currentUser = await this.storage.get(this.currentUserPrefix);
      if (token && currentUser) {
        this.useCredentials(token,currentUser);
        resolve(currentUser)
      }
    })
  }

  storeUserCredentials(token,currentUser) {
    //if (user.remember){
      this.storage.set(this.tokenPrefix, token);
      this.storage.set(this.currentUserPrefix, currentUser);
    //}
    this.useCredentials(token,currentUser);
  }

  storeUser(currentUser) {
    this.storage.set(this.currentUserPrefix, currentUser);
    this.user = currentUser;
  }

  async getUser(){
    if (this.user)
      return this.user;
    else{
      return await this.storage.get(this.currentUserPrefix);
    }
  }

  setUser(user){
    this.user = user;
    this.storage.set(this.currentUserPrefix, user);
  }

  useCredentials(token,currentUser) {
    console.log('i use the creadentials');
    this.isAuthenticated = true;
    this.authToken = token;
    this.user = currentUser;
    this.role = currentUser.role;
    console.log(this.user);
    setTimeout(() => {
      this.events.publish('onLogin');
    }, 100);
  }

  destroyUserCredentials() {
    return new Promise((resolve) => {
      this.authToken = undefined;
      this.isAuthenticated = false;
      this.storage.remove(this.currentUserPrefix);
      this.storage.remove(this.tokenPrefix);
      // this.storage.remove('userSettings');
      this.user = null;
      resolve(true);
    });
  }

  async getDeviceInfo() {
    let deviceId = this.deviceId || await this.storage.get(this.deviceIdPrefix)
    return {
      platform: this.device.platform,
      model: this.device.model,
      version: this.device.version,
      manufacturer: this.device.manufacturer,
      deviceId
    }
  }

  registerDevice(deviceId) {
    return new Promise( async (resolve)=> {
      let data = {
        deviceId
      }
      this.httpHelper.request('post','/devices', data).subscribe();
    })
  }

  register(user, type): Promise<any>{
    return new Promise( async (resolve, reject)=> {
      this.UI.loading();
      // let deviceId = await this.storage.get('deviceId');
      let settings = this.appConfig.userSettings.country ? this.appConfig.userSettings : await this.storage.get('userSettings');
      let data = {
        ...user,
        ...await this.getDeviceInfo(),
        settings
      }
      this.httpHelper.request('post', `/register/${type}`, data).subscribe((response) => {
        this.UI.unLoading();
        let resp = response.json();
        this.storeUserCredentials(resp.token, resp.user);
        resolve(resp);
      }, err => {
        this.UI.fireError(err)
        reject(err)
      })
    })
  }

  login(user) {
    return new Promise( async (resolve, reject)=> {
      this.UI.loading();
      // let deviceId = await this.storage.get('deviceId');
      let settings = this.appConfig.userSettings.country ? this.appConfig.userSettings : await this.storage.get('userSettings');
      let data = {
        ...user,
        ...await this.getDeviceInfo(),
        settings
      }
      this.httpHelper.request('post', '/login', data).subscribe(response => {
        this.UI.unLoading();
        let resp = response.json();
        this.storeUserCredentials(resp.token,resp.user);
        this.UI.fireSuccess('login.success');
        resolve(resp);
      }, err => {
        this.UI.fireError(err)
        reject(err)
      })
    })
  }

  updateProfile(user, type): Promise<any>{
    return new Promise( async (resolve, reject)=> {
      let settings = this.appConfig.userSettings.country ? this.appConfig.userSettings : await this.storage.get('userSettings');
      let data = {
        ...user,
        ...await this.getDeviceInfo(),
        settings
      }
      this.UI.loading()
      this.httpHelper.request('post', `/register/${type}`, data).subscribe((response) => {
        this.UI.unLoading();
        const user = response.json();
        this.storeUser(user);
        resolve(user);
      }, err => {
        this.UI.fireError(err)
        reject(err)
      })
    })
  }
  

  forgotRequest(email) {
    return new Promise((resolve)=> {
      this.UI.loading();
      this.httpHelper.request('post','/forgot',{email}).subscribe(res => {
        this.UI.unLoading();
        resolve(res.json());
      }, err => this.UI.fireError(err))
    })
  }

  resetPassword(password, token) {
    return new Promise(async (resolve) => {
      const data = {
        password,
        'password_confirmation': password,
        ...await this.getDeviceInfo(),
        token
      }
      this.UI.loading();
      return this.httpHelper.request('post','/reset', data).subscribe(res => {
        this.UI.unLoading();
        let resp = res.json();
        this.storeUserCredentials(resp.token,resp.user);
        this.UI.fireSuccess('login.success');
        resolve(resp);
      }, err => this.UI.fireError(err));
    })
  }

  logout() {
    return new Promise(async (resolve)=> {
      this.UI.loading();
      this.httpHelper.request('post','/logout',{...await this.getDeviceInfo()}).subscribe(res => {
        this.UI.unLoading();
        this.destroyUserCredentials();
        resolve(res.json());
      }, err => this.UI.fireError(err))
    })
  }

}