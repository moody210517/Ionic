import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ApiServicesProvider } from '../../providers/api-services/api-services';

@IonicPage()
@Component({
  selector: 'page-discussion',
  templateUrl: 'discussion.html',
})
export class DiscussionPage {
  private product: any = {};
  private discussions: any = [];
  constructor(
    public navCtrl: NavController, 
    private events: Events, 
    public navParams: NavParams,
    private services: ApiServicesProvider
  ){
    // events.subscribe('leaveChat', (phone) => {
    //   this.getdiscussion();
    // });
    this.product = this.navParams.get("product");
  }

  ionViewDidLoad() {
    this.getdiscussion();
  }
  
  getdiscussion() {
    this.services.chatList(this.product.id).then((discussion: any) => {
      this.discussions = discussion;
      console.log(this.discussions); 
    }).catch(err => {
      this.services.fireError(err);
    })
  }
  gotoChat(conversation) {
    this.navCtrl.push("ChatPage", { conversation });
  }
}
