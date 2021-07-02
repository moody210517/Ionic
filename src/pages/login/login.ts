import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { UiProvider } from '../../providers/ui/ui';
import { Device } from '@ionic-native/device';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('mailConfirmation') mailConfirmation: ElementRef;

  private addReginForm: any;
  private user: any = {};
  private showMessagebox = false;
  private submitReg: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    private services: ApiServicesProvider,
    private ui: UiProvider,
    public plt: Platform,
    private device: Device,
    public events: Events) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.addReginForm = formBuilder.group({
      email: ["",Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ["",Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  userLogin() {
    this.submitReg = true;
    if (this.addReginForm.valid) {
      this.ui.loading();

      let deviceData = this.services.device_data;
      setTimeout(() => {
        if (Object.keys(deviceData).length !== 0) {
          console.log("From Login1 ", deviceData);
          this.user.platform = deviceData.os;
          this.user.deviceid = deviceData.reg_id;
        } 
        // else {
        //   console.log("From Login2 ", deviceData);
        //   this.user.platform = "Browser";
        //   this.user.deviceid = JSON.stringify(Date());
        // }
        console.log(this.user, " <<< We HAVE THIS USER WANT TO REGISTER");
        this.services.login(this.user).then((res: any) => {

          console.log(res);
          this.ui.unLoading();
          this.submitReg = false;
          this.services.isLoggedIn = true;
          this.services.current_user = res.user;
          let tokens = {
            'token': res.token,
            'refresh_token': res.refresh_token
          }

          console.log("user", res.user);
          console.log("token", tokens);

          //localStorage.setItem('onatrouvé_user', JSON.stringify(res.user));
          //localStorage.setItem('onatrouvé_token', JSON.stringify(tokens));
          //this.events.publish('user_loggedIn', JSON.stringify(res.user));
          this.navCtrl.setRoot('MapPage');

        }).catch(err => {
          console.log("--- login error ---")
          console.log(err.json().message);
          this.submitReg = false;
          this.services.fireError(err.json());
          this.ui.unLoading();

        })
      }, 2000);
    }
  }

  resetPassword() {
    if (this.addReginForm.controls.email.valid) {
      this.services.sendResetEmail(this.user.email).then(res => {
        this.submitReg = false;
        this.mailConfirmation.nativeElement.style.top = "0px";
        setTimeout(() => {
          this.mailConfirmation.nativeElement.style.top = "-200px";
        }, 5000);
      }).catch((err: any) => {
        console.log(err.json());
        this.services.fireError(err.json());
      })

    } else {
      this.submitReg = true;
    }
  }
}
