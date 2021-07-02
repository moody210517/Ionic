import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { JwtHelperProvider } from "../jwt-helper/jwt-helper";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import { Events } from 'ionic-angular';
import { AppConfigProvider } from '../app-config/app-config';

@Injectable()
export class HttpHelperProvider {

	constructor(
		public http: Http,
		public appSettings: AppConfigProvider,
		public jwt: JwtHelperProvider,
		public events: Events
	) {}

	private methods(method: string, url: string, params?: any, options?: any) {
		method = method.toLowerCase()
		if (url[0] == '/') {
			url = this.appSettings.API + url;
		}
		// return this.http.options(url, {method, params, ...options})
		if (method == 'get' || method == 'delete')
			return this.http[method](url, options)
		else {
			return this.http[method](url, params, options)
		}
	}

	private refreshToken(tokens, options) {
		return this.http.post(this.appSettings.API + '/token/refresh', { 'refresh_token': tokens.token }, options)
			.map(response => {
				let resp = response.json();
				let tokens = {
					'token': resp.token,
					'refresh_token': resp.token
				}
				localStorage.setItem('onatrouvé_token', JSON.stringify(tokens));
				let headers = new Headers();
				headers.append('Authorization', 'Bearer ' + tokens.token);
				headers.append('Accept', 'application/json');
				return options = new RequestOptions({ 'headers': headers });
			}).catch(error => {
				this.events.publish('sessionExpired', error);
				return Observable.throw('refreshTokenError');
			});
	}

	public request(method: string, url: string, data?: any, options?: any): Observable<any> {
		let tokens = JSON.parse(localStorage.getItem('onatrouvé_token'));
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');
		options = new RequestOptions({ 'headers': headers });
		if (tokens) {
			if (tokens.token) {
				headers.append('Authorization', 'Bearer ' + tokens.token);
				options = new RequestOptions({ 'headers': headers });
				if (this.jwt.isTokenExpired(tokens.token)) {
					console.log("isTokenExpired = true");
					return this.refreshToken(tokens, options)
						.flatMap((options) => this.methods(method, url, data, options))
				} else {
					return this.methods(method, url, data, options);
				}
			} else
				return this.methods(method, url, data, options);
		} else
			return this.methods(method, url, data, options);
	}

}
