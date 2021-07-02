import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { UiProvider } from '../ui/ui';
import { AppConfigProvider } from '../app-config/app-config';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpHelperProvider } from '../http-helper/http-helper';


@Injectable()
export class ApiServicesProvider {
  current_position: any = {};
  isLoggedIn: boolean = false;
  current_user: any = null;
  counts_products: any = 0;
  device_data: any = {}
  constructor(public http: Http,
    private ui: UiProvider, private config: AppConfigProvider,
    private transfer: FileTransfer, private file: File,
    private platform: Platform,
    // private backgroundGeolocation: BackgroundGeolocation,
    private geolocation: Geolocation,
    private httpHelper: HttpHelperProvider) {
    // setTimeout(() => {
    //   this.sendGpsToApi();
    // }, 10000);
    console.log('Hello ApiServicesProvider Provider');
  }

  getsearchMyAds(val: any) {
    return new Promise((resolve, reject) => {
      this.httpHelper.request("get", this.config.API + '/search/products/' + val).subscribe((data) => {
        resolve(data.json())
      }, (error) => {
        reject(error);
        this.ui.fireError(error);
      });
    });
  }

  getsearchAds(val: any, category) {
    return new Promise((resolve, reject) => {
      let term = category ? '/category/' + category + '/search/' + val : '/search/' + val;
      this.http.get(this.config.API + term).subscribe((data) => {
        resolve(data.json())
      }, (error) => {
        reject(error);
        this.ui.fireError(error);
      });
    });
  }

  // sendGpsToApi(location,suivis){
  //   return new Promise((resolve, reject) => {
  //     this.httpHelper.request('post',this.config.API+'/locate',{...location,targets_ids:suivis}).subscribe((data)=>{
  //       resolve(data);
  //     },(error)=>{
  //       reject(error);
  //     })
  //   });
  // }

  sendGpsToApi(location, suivis) {
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', 'http://192.168.1.29:3003/geolocation', { ...location, targets_ids: suivis }).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      })
    });
  }

  getDiscussionsById(discussion_id) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.http.get(this.config.API + '/discussion/' + discussion_id).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json())
      }, (error) => {
        this.ui.unLoading();
        reject(error);
      });
    });
  }

  deletesearch(suivi_id) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/search/delete', { suivi_id: suivi_id }).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json())
      }, (error) => {
        this.ui.unLoading();
        reject(error);
      });
    });
  }
  getsearches() {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('get', this.config.API + '/searches').subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json())
      }, (error) => {
        this.ui.unLoading();
        reject(error);
      });
    });
  }
  checkfavories(product_id) {
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/checkfavory', { product_id: product_id }).subscribe((data) => {
        resolve(data.json())
      }, (error) => {
        reject(error);
      });
    });
  }
  getRegions() {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.http.get(this.config.API + '/regions').subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json())
      }, (error) => {
        this.ui.unLoading();
        reject(error);
      });
    });
  }

  getuserByID(user_id) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.http.get(this.config.API + '/getuser/' + user_id).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json())
      }, (error) => {
        this.ui.unLoading();
        reject(error);
      });
    });
  }

  getProductsByRegion(region, pager?, noloding?) {
    if (!noloding)
      this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('get', this.config.API + '/products/' + region + '?page=' + pager).subscribe((data) => {
        console.log(data.json().data);
        if (!noloding)
          this.ui.unLoading();
        resolve(data.json().data);
      }, (error) => {
        if (!noloding)
          this.ui.unLoading();
        reject(error.json());
      });
    });
  }

  getProductsBySearch(region, search_term) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/search', { region: region, search: search_term }).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        reject(error);
      });
    });
  }

  getAllProducts(pager, noloding?, filter?) {
    console.log("From services => ", filter.range);
    if (!noloding)
      this.ui.loading();
    return new Promise((resolve, reject) => {

      if (filter.range) {
        this.httpHelper.request('get', this.config.API + '/products?page=' + pager + '&date=' + filter.date + '&distance=' + filter.distance + '&price=' + filter.price + '&lat=' + filter.lat + '&lng=' + filter.lng + '&range_lower=' + filter.range.lower + '&range_upper=' + filter.range.upper).subscribe((data) => {
          if (!noloding)
            this.ui.unLoading();
          resolve(data.json().data);
        }, (error) => {
          if (!noloding)
            this.ui.unLoading();
          reject(error);
        });
      } else {
        this.http.get(this.config.API + '/products?page=' + pager + '&date=' + filter.date + '&distance=' + filter.distance + '&price=' + filter.price + '&lat=' + filter.lat + '&lng=' + filter.lng).subscribe((data) => {
          if (!noloding)
            this.ui.unLoading();
          resolve(data.json().data);
        }, (error) => {
          if (!noloding)
            this.ui.unLoading();
          reject(error);
        });
      }
    });
  }
  deletesuivi(product_id) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/suivi/delete', { product_id }).subscribe((data) => {
        // this.http.post(this.config.API+'/product',{...product}).subscribe((data)=> {
        this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        reject(error.json());
      });
    });
  }

  countsProduct() {
    return new Promise((resolve, reject) => {
      this.httpHelper.request('get', this.config.API + '/counts').subscribe((data) => {
        resolve(data.json());
      }, (error) => {
        reject(error.json());
      });
    });
  }

  getProductsByCategory(category, pager?, nolodaing?, filter?) {
    if (!nolodaing)
      this.ui.loading();
    console.log("From services => ", filter.range);
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/products/category', { category: category, page: pager, date: filter.date, distance: filter.distance, price: filter.price, lat: filter.lat, lng: filter.lng, range: filter.range }).subscribe((data) => {
        if (!nolodaing)
          this.ui.unLoading();
        if (data['_body'])
          resolve(data.json().data);
        else
          resolve([]);
      }, (error) => {
        if (!nolodaing)
          this.ui.unLoading();
        reject(error);
      });
    });
  }

  addNewProduct(product: any) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/product', { ...product }).subscribe((data) => {
        // this.http.post(this.config.API+'/product',{...product}).subscribe((data)=> {
        this.ui.unLoading();
        this.ui.toast("Le produit a été ajouté");
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        reject(error.json());
      });
    });
  }
  
  addvisitors(product_id) {
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/visitors', { product_id: product_id }).subscribe((data) => {
        this.ui.unLoading();
        console.log("Visitors ", data.json());
        resolve(data.json());
      }, (error) => {
        reject(error.json());
      });
    });
  }
  
  addFullProduct(product, audiopath?) {
    return new Promise((resolve, reject) => {
      console.log(audiopath);
      this.addNewProduct(product).then((res: any) => {
        console.log("Return From Product Result SUccess");
        console.log(res);
        let product_id = res.id;
        console.log("this is the product ID : ", product_id);
        if (audiopath) {
          this.uploadAudio(audiopath, product_id).then(res => {
            console.log("Return From Audio Result SUccess");
            resolve(res);
            console.log(res);
          }, err => {
            reject(err);
            this.fireError(err);
            reject(err);
            this.fireError(err);
            console.log("Return From Audio Result Failed", err);
          })
        } else {
          resolve(res);
        }

      }, err => {
        console.log("Return From Product Result SUccess", err);
        this.fireError(err);
        reject(err);
      })
    });
  }
  uploadAudio(filepath, productid) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    return new Promise((resolve, reject) => {
      let options: FileUploadOptions = {
        fileKey: 'voiceRecorder',
        mimeType: 'audio/mp3',
        httpMethod: 'post',
        chunkedMode: false,
        headers: { 'Content-Type': undefined },
        params: { 'product_id': productid }
      }

      console.log(filepath);
      console.log(this.config.API + '/uploadAudio');
      console.log(fileTransfer);
      fileTransfer.abort();
      fileTransfer.upload(filepath, this.config.API + '/uploadAudio', options, true)
        .then((data) => {
          console.log('Success Upload : ', data);
          resolve(data);

        }).catch((err) => {
          console.log('Error Upload : ', err);
          this.ui.toast("Erreur : Audio Upload ");
          reject(err);
        })
    })
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.API + '/categories').subscribe((data) => {
        resolve(data.json());
      }, (error) => {
        reject(error);
      });
    })
  }

  getProperties(category_id) {
    return new Promise((resolve, reject) => {
      this.httpHelper.request('get', this.config.API + '/properies/' + category_id).subscribe((data) => {
        resolve(data.json());
      }, (error) => {
        reject(error);
      });
    })
  }

  getCurrentLocation(noloding?) {
    return new Promise((resolve, reject) => {
      if (!noloding)
        this.ui.loading();
      let options = {
        enableHighAccuracy: true,
        timeout: 5000
      };
      this.geolocation.getCurrentPosition(options).then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log(resp);
        console.log("This Wat Must Be In The details", resp)
        if (!noloding)
          this.ui.unLoading();
        resolve(resp);
      }).catch((error) => {
        this.ui.toast('errors.loaction', error);
        if (!noloding)
          this.ui.unLoading();
        console.log('Error getting location', error);
        reject(error);
      });
    })
  }

  register(user_info) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.API + '/register', { ...user_info }).subscribe((data) => {
        resolve(data.json());
      }, (error) => {
        reject(error);
      });
    })
  }

  login(user_info) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.API + '/login', { ...user_info }).subscribe((data) => {
        resolve(data.json());
      }, (error) => {
        reject(error);
      });
    })
  }

  fireError(err) {
    console.log(err);
    if (err.errors) {
      let messageArray = "";
      for (let element in err.errors) {
        console.log(err.errors[element][0]);
        messageArray = messageArray + (err.errors[element][0] + "/n");
      }
      this.ui.toast(messageArray, '', "", null, 5000);
    } else if (err.error) {
      this.ui.toast(err.error, '', "", null, 5000);
    } else {
      this.ui.toast("Une erreur est survenue", '', "", null, 5000);
    }
  }

  getfavories() {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('get', this.config.API + '/favories').subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        reject(error.json());
      });
    });
  }

  addfavories(product_id) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/favories', { product_id: product_id }).subscribe((data) => {
        this.ui.unLoading();
        console.log("Favories ", data.json());
        resolve(data.json());
      }, (error) => {
        reject(error.json());
        this.ui.unLoading();
      });
    });
  }

  deleteFavory(product) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/favory/delete', { "product_id": product }).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        reject(error.json());
      });

    });
  }

  addrates(product_id, rates) {
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/rates', { product_id: product_id, rates: rates }).subscribe((data) => {
        this.ui.unLoading();
        console.log("Rates ", data.json());
        resolve(data.json());
      }, (error) => {
        reject(error.json());
      });
    });
  }
  checkFavory(product_id) {
    return new Promise((resolve, reject) => {
      this.httpHelper.request('get', this.config.API + '/isfavory/' + product_id).subscribe((data) => {
        resolve(data.json());
      }, (error) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>", error);
        reject(error.json());
      });
    });
  }
  getmyproducts(pager?, noloding?) {
    if (!noloding)
      this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('get', this.config.API + '/owers?page=' + pager).subscribe((data) => {
        console.log(data.json().data);
        if (!noloding)
          this.ui.unLoading();
        resolve(data.json().data);
      }, (error) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>", error);
        if (!noloding)
          this.ui.unLoading();
        reject(error.json());
      });
    });
  }

  getDiscussions(product_id) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/discussions', { product_id: product_id }).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        reject(error.json());
      });
    });
  }

  getCurrentdiscussion(product_id, opner?) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/currentdiscussion', { product_id: product_id, opner: opner }).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        reject(error.json());
      });
    });
  }

  sendMesages(discussion_id, message, reciever) {
    // this.ui.loading();
    console.log("Here wat You Send", discussion_id, message);
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/savediscussion', { 'discussion_id': discussion_id, 'message': message, 'reciever': reciever }).subscribe((data) => {
        // this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        // this.ui.unLoading();
        reject(error.json());
      });
    });
  }

  sendNotification(reciever, message) {
    // this.ui.loading();
    console.log("Here wat You Send Notification to ", reciever, " : ", message);
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/sendNotification', { 'receiver': reciever, 'message': message }).subscribe((data) => {
        // this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        // this.ui.unLoading();
        reject(error.json());
      });
    });
  }
  logout() {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      let device_data = this.device_data;
      this.isLoggedIn = false;
      setTimeout(() => {
        localStorage.clear();
      }, 100);
      console.log("Here wat You Send Notification to ", device_data);
      this.httpHelper.request('post', this.config.API + '/logout', { "deviceid": device_data.reg_id }).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        reject(error.json());
      });
    })
  }

  sendResetEmail(email) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/mail', { "email": email }).subscribe((data: any) => {
        this.ui.unLoading();
        resolve(data);
      }, (error: any) => {
        this.ui.unLoading();
        let error_mail = JSON.stringify(error, ["status", "arguments", "type", "name"]);
        let error_status = JSON.parse(error_mail).status;
        console.log(error_status);
        if (error_status == 0)
          resolve(true);
        else
          reject(error);
      });

    });
  }

  getproductbyId(product_id, noload?) {
    if (!noload)
      this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('get', this.config.API + '/product/' + product_id).subscribe((data: any) => {
        if (!noload)
          this.ui.unLoading();
        resolve(data);
      }, (error: any) => {
        if (!noload)
          this.ui.unLoading();
        reject(error.json());
      });

    });
  }

  delete(product) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/delete', { "product_id": product.id }).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        reject(error.json());
      });

    });
  }

  suiviAnnonce(product?) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/suivi', { ...product }).subscribe((data) => {
        this.ui.unLoading();
        resolve(data.json());
      }, (error) => {
        this.ui.unLoading();
        console.log(error);
        reject(error.json());
      });

    });
  }

  changepassword(token, password) {
    this.ui.loading();
    return new Promise((resolve, reject) => {
      this.httpHelper.request('post', this.config.API + '/reset/password', { "token": token, "password": password }).subscribe((data: any) => {
        this.ui.unLoading();
        resolve(data);
      }, (error) => {
        this.ui.unLoading();
        reject(error.json());
      });

    });
  }

  // Chat methods
  /**
  *	 initConversation Chat
  *	 @param senderId: required
  *	 @param receiverId: required
  */
  initConversation(data, page?, infiniteScroll?): Promise<any> {
    return new Promise(async (resolve) => {
      if (!infiniteScroll)
        this.ui.loading();
      this.httpHelper.request('POST', `/chat/init?page=${page}`, data).subscribe(response => {
        let resp = response.json();
        this.ui.unLoading();
        resolve(resp);
      }, err => this.ui.fireError(err))
    })
  }

  deleteConversation(conversationId) {
    return new Promise(async (resolve) => {
      this.httpHelper.request('DELETE', `/chat/conversations/${conversationId}`).subscribe(response => {
        let resp = response.json();
        resolve(resp);
      }, err => this.ui.fireError(err))
    })
  }

  /**
  *	 chatList Chat
  */
  chatList(productId?): Promise<any> {
    return new Promise(async (resolve) => {
      this.ui.loading();
      this.httpHelper.request('GET', `/chat/list/${productId}`).subscribe(response => {
        let resp = response.json();
        this.ui.unLoading();
        resolve(resp);
      }, err => this.ui.fireError(err))
    })
  }

  /**
  *	 storeMessage Chat
  *	 @param body: required
  *	 @param conversationId: required
  */
  storeMessage(data) {
    return new Promise(async (resolve) => {
      this.httpHelper.request('POST', '/chat/message', data).subscribe(response => {
        let resp = response.json();
        resolve(resp);
      }, err => this.ui.fireError(err))
    })
  }
}
