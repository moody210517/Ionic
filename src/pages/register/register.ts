import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { UiProvider } from '../../providers/ui/ui';
import { Device } from '@ionic-native/device';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public addReginForm: any;
  public submitReg: boolean = false;
  public isProfile: boolean = false;
  public showpassword: boolean = false;
  public user: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private services: ApiServicesProvider,
    private ui: UiProvider,
    private viewCtr: ViewController,
    private events: Events,
    public plt: Platform,
    private device: Device
  ) {
    this.isProfile = this.navParams.get('profile') ? true : false;
    console.log(this.isProfile);
    let phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](\d{2}){4}$/g;
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (this.isProfile) {
      this.user = this.services.current_user;
      this.addReginForm = formBuilder.group(
        {
          name: [
            "",
            Validators.compose([Validators.required, Validators.minLength(3)])
          ],

          last_name: [
            "",
            Validators.compose([Validators.required, Validators.minLength(3)])
          ],
          email: [
            "",
            Validators.compose([Validators.required, Validators.pattern(emailRegex)
            ])
          ],
          phone: [
            "",
            Validators.compose([Validators.required, Validators.pattern(phoneRegex)
            ])
          ]
        });
    } else {
      this.addReginForm = formBuilder.group(
        {
          name: [
            "",
            Validators.compose([Validators.required, Validators.minLength(3)])
          ],

          last_name: [
            "",
            Validators.compose([Validators.required, Validators.minLength(3)])
          ],
          email: [
            "",
            Validators.compose([Validators.required, Validators.pattern(emailRegex)
            ])
          ],
          phone: [
            ""
          ],
          password: [
            "",
            Validators.compose([Validators.required, Validators.minLength(8)])
          ],
          vpassword: [
            "",
            Validators.compose([Validators.required, Validators.minLength(8)])
          ]
        },
        { validator: this.checkIfMatchingPasswords("password", "vpassword") });
    }

  }


  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  cahngepasswordView() {
    this.showpassword = !this.showpassword;
    console.log(this.showpassword);
  }


  userDataSubmit() {
    this.submitReg = true;
    if (this.addReginForm.valid) {
      if (this.isProfile) {
        this.user.id = this.services.current_user.id;
        delete this.user.password;
      }
      this.ui.loading();
      let deviceData = JSON.parse(localStorage.getItem('deviceData'));
      if (deviceData) {
        this.user.platform = deviceData.os;
        this.user.deviceid = deviceData.reg_id;
      } 
      // else {
      //   this.user.platform = "Browser";
      //   this.user.deviceid = JSON.stringify(Date());
      // }
      console.log(this.user, " <<< We HAVE THIS USER WANT TO REGISTER");
      this.services.register(this.user).then((res: any) => {
        console.log(res);
        this.ui.unLoading();
        this.submitReg = false;
        if (!this.isProfile) {
          this.services.isLoggedIn = true;
          this.services.current_user = res.user;
          let tokens = {
            'token': res.token,
            'refresh_token': res.refresh_token
          }
          localStorage.setItem('onatrouvé_user', JSON.stringify(res.user));
          localStorage.setItem('onatrouvé_token', JSON.stringify(tokens));
          this.events.publish('user_loggedIn', res.user);
          this.navCtrl.setRoot('MapPage');
        }else {
          this.viewCtr.dismiss();
        }
      }).catch(err => {
        console.log(err.json().message);
        this.submitReg = false;
        this.services.fireError(err.json());
        this.ui.unLoading();

      })
    }
  }

  closeModal() {
    this.viewCtr.dismiss();
  }
}
