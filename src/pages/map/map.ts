import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import * as $ from "jquery";
import { HomePage } from '../home/home';
import { ApiServicesProvider } from '../../providers/api-services/api-services';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChild('logo') logo: ElementRef;
  @ViewChild('chat_input') myInput;
  private showbutton: any = false;
  private filtred: any = [];
  private focused: boolean = false;
  private autocomplete: boolean = false;
  private regions: any[] = [{ "title": "- Vide -" }];
  private address: any;
  private chosedRegion: boolean = false;
  constructor(public navCtrl: NavController, private modalCtrl: ModalController, public navParams: NavParams, private services: ApiServicesProvider) {
    let self = this;
    $(document).ready(function () {
      $('path').on("click", function (event) {
        $('path').css("fill", "#c4bcb2");
        $(this).css("fill", "#f0b43e");
        this.showbutton = true;
        console.log(this.showbutton);
        setTimeout(() => {
          self.navCtrl.push(HomePage, { "location": $('path').attr("id") });
        }, 200);
      });
    });
    this.filtred = this.regions;

  }


  gotoHome() {
    // this.navCtrl.push(HomePage,{"region":this.address});
    this.navCtrl.push(HomePage, { "openMenu": true });
  }

  filterItems(ev: any) {
    this.chosedRegion = false;
    let val = ev.target.value;
    let me = this;
    console.log('val');
    this.filtred = this.regions;
    if (val && val.trim() !== '') {
      console.log("This is The value ", val, " / ", val.trim());
      this.filtred = this.filtred.filter(function (item) {
        return item.name.toLowerCase().includes(val.toLowerCase());
      });
      if (this.filtred.length > 0)
        me.autocomplete = true;
      else
        me.autocomplete = false;
      console.log("After-Filter-Search : ", this.filtred);
    } else
      me.autocomplete = false;
  }

  choseRegion(filter) {
    this.address = filter.name;
    this.autocomplete = false;
    this.chosedRegion = true;
    console.log("Chosed Region Here ", this.chosedRegion)
  }
  changePosition($event) {
    this.focused = true;
    this.mainContainer.nativeElement.style.transform = "translateY(0%)";
    this.mainContainer.nativeElement.style.width = "100%";
    this.logo.nativeElement.style.transform = "translateX(-50%) rotate(360deg)";
    this.logo.nativeElement.style.width = "0px";
    console.log(this.mainContainer.nativeElement);
  }

  changePositionBlur($event) {
    setTimeout(() => {
      this.focused = false;
      this.mainContainer.nativeElement.style.transform = "translateY(50%)";
      this.logo.nativeElement.style.transform = "translateX(-50%)";
      this.logo.nativeElement.style.width = "120px";
      console.log(this.mainContainer.nativeElement);
    }, 10);

  }


  openModal(pageName) {
    let modal = this.modalCtrl.create(pageName);
    modal.present();
  }

  profileEdit() {
    let modal = this.modalCtrl.create("RegisterPage", { profile: true });
    modal.present();
  }
}
