import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { UiProvider } from '../../providers/ui/ui';
/**
 * Generated class for the MapPikkerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-map-pikker',
  templateUrl: 'map-pikker.html',
})
export class MapPikkerPage {
  title:string;
  map: any = {
    lat:45.087890625,
    lng:2.321167252957821,
    zoom: 2
  };
  marker: any = {}; 
  product: any;
  address: any = '';
  constructor(public viewCtrl: ViewController, public navParams: NavParams,
              private ui: UiProvider,
              private geolocation: Geolocation) 
  {
    this.product = this.navParams.get('product') || {};
    if(this.navParams.get('title'))
    this.title= this.navParams.get('title');
    console.log("This is The product Here >> ",this.product);

    if (!this.product ||  (this.product && !this.product.address) || (this.product && this.product.address && !this.product.address.address)){
      console.log("Enter to Get Position ");
      this.getCurrentPosition();
    }

    else {
      let latLng = {
        lat: Number(this.product.address.lat),
        lng: Number(this.product.address.long)
      }
      
      console.log(this.product.address);
      this.map = latLng;
      this.map.zoom = 8;
      this.marker = latLng;
      this.address = this.product.address.address;
    }
  }

  getCurrentPosition() {
    this.ui.loading();
    let options = {
      enableHighAccuracy : true,
      timeout:5000
    };
    console.log("afterStartLoading");
    this.geolocation.getCurrentPosition(options).then((resp)=> {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp);
      this.map = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
        zoom: 8
      }
      this.marker = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
      };
      console.log(this.marker);
      this.geocodeLatLng(this.marker).then((resp)=> {
        this.address = resp;
      })
      this.ui.unLoading();
    }).catch((error) => {
      this.ui.toast('errors.loaction',error)
      this.ui.unLoading();
      console.log('Error getting location', error);
    });
  }

  mapClicked(ev) {
    this.marker = {
      lat: ev.coords.lat,
      lng: ev.coords.lng
    };
    this.geocodeLatLng(this.marker).then((resp)=> {
      this.address = resp;
      console.log("this is the Map responce" ,resp);
    })
  }

  clickedMarker(marker) {
    console.log(marker);
  }

  markerDragEnd(marker, ev) {
    this.marker = {
      lat: ev.coords.lat,
      lng: ev.coords.lng 
    };
    this.geocodeLatLng(this.marker).then((resp)=> {
      this.address = resp;
      console.log(this.address);
    })
  }

  geocodeLatLng(latlng) {

    return new Promise((resolve, reject)=> {
      try{
      let geocoder = new google.maps.Geocoder();
      this.ui.loading();
      geocoder.geocode({'location': latlng}, (results, status)=> {
        this.ui.unLoading();
        if (status === 'OK') {
          console.log("This is the results to get Region : ",results)
          if (results[1]) {
            console.log(results[0].formatted_address);
            this.address = results[0].formatted_address;
            resolve(results[0].formatted_address);
          } else {
            this.ui.alert('map.error','map.noResult');
            reject('No results found');
          }
        } else {
          this.ui.alert('map.error','map.geoFaild');
          reject('Geocoder failed due to: ' + status);
        }
     
      });
    }catch(e){
    console.log(e);
    }
    });
  }

  confirmAddress() {
    if (this.marker.lat) {
      // this.geocodeLatLng(this.marker).then((resp)=> {
        let params: any = {
          lat: this.marker.lat,
          long: this.marker.lng,
          address: this.address
        }
        this.viewCtrl.dismiss(params);
      // })
    }else {
      this.ui.alert('Warrning','map.chooseLocation');
    }
      
  }

  closeModal() {
    // if (this.marker.lat) {
    //   this.geocodeLatLng(this.marker).then((resp)=> {
    //     this.viewCtrl.dismiss({address: resp});
    //   }).catch((err)=> this.viewCtrl.dismiss())
    // }else
      this.viewCtrl.dismiss();
  }

}
