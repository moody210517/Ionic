import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UiProvider } from '../../providers/ui/ui';
import { ApiServicesProvider } from '../../providers/api-services/api-services';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  private addReginForm: any;
  private submitReg:boolean=false;
  private token:any;
  private showpassword:boolean=false;
  private user:any={};
  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private ui:UiProvider,
    private services:ApiServicesProvider,
    public navParams: NavParams) {
    this.token=this.navParams.get("token");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> TOKEN TOKEN",this.token);
    this.addReginForm = formBuilder.group(
        {
          password: [
            "",
            Validators.compose([Validators.required, Validators.minLength(8)])
          ],
          vpassword: [
            "",
            Validators.compose([Validators.required, Validators.minLength(8)])
          ]}, { validator: this.checkIfMatchingPasswords("password", "vpassword") });
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }
 cahngepasswordView()
{
  this.showpassword=!this.showpassword;
  console.log(this.showpassword);
}
changePassword(){
  this.submitReg=true;
  if(this.addReginForm.valid){
    this.services.changepassword(this.token,this.user.password).then(()=>{
      console.log('passwordChanged');
      this.navCtrl.setRoot('LoginPage');
      this.ui.toast("Mot de Passe Changer",null,null,3000,'top');
    }).catch((err:any)=>{
    this.services.fireError(err);
    });
   
  }
}
}
