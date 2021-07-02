import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraProvider {
  constructor(public platform: Platform,
  						public events: Events,
              private camera: Camera) {
    
  }

  fromCamera() {
		return new Promise((resolve, reject) => {
			let options: CameraOptions = {
				destinationType: this.camera.DestinationType.DATA_URL,
				sourceType: this.camera.PictureSourceType.CAMERA,
				encodingType: this.camera.EncodingType.JPEG,
				quality: 50,
				targetWidth: 500,
				correctOrientation: true
			};
			this.platform.ready().then(() => {
				this.camera.getPicture(options).then((imageData) => {
					let base64Image = 'data:image/jpeg;base64,' + imageData;
					this.events.publish('image:success', base64Image);
					resolve(base64Image);
				}, (err) => {
					reject(err);
					console.log('err get image : ', err);
				});
			});
		});
	}

	fromGalley() {
		return new Promise((resolve, reject) => {
			let options: CameraOptions = {
				destinationType: this.camera.DestinationType.DATA_URL,
				sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
				encodingType: this.camera.EncodingType.JPEG,
				quality: 50,
				targetWidth: 500,
				correctOrientation: true
			};
			this.platform.ready().then(() => {
				this.camera.getPicture(options).then((imageData) => {
					let base64Image = 'data:image/jpeg;base64,' + imageData;
					this.events.publish('image:success', base64Image);
					resolve(base64Image);
				}, (err) => {
					reject(err);
					console.log('err get image : ', err);
				// Handle error
				});
			});
		});
	}

}
