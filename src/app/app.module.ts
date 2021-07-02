import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AgmCoreModule } from "@agm/core";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicRatingModule } from 'ionic-rating';
import { UiProvider } from "../providers/ui/ui";
import { Camera } from '@ionic-native/camera';
import { HttpModule, Http } from '@angular/http';
import {TranslateModule,TranslateLoader} from '@ngx-translate/core';
import { CameraProvider } from '../providers/camera/camera';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ApiServicesProvider } from '../providers/api-services/api-services';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { LongPressModule } from 'ionic-long-press'; 
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { Media, MediaObject } from '@ionic-native/media';
import{HttpHelperProvider} from '../providers/http-helper/http-helper';
import { JwtHelperProvider } from '../providers/jwt-helper/jwt-helper';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Device } from '@ionic-native/device';
import { PipesModule } from '../pipes/pipes.module';
import { Push } from '@ionic-native/push';
import { BranchIo } from '@ionic-native/branch-io';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { Dialogs } from '@ionic-native/dialogs';
import {Badge} from '@ionic-native/badge'
import { TimeAgoPipeModule } from '../pipes/time-ago-pipe/index';
import { StorageProvider } from '../providers/storage/storage';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { ComponentsModule } from '../components/components.module';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { PluginProvider } from '../providers/plugin-service/plugin-service';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';



const config: SocketIoConfig = { url: 'http://vps-6496d4c1.vps.ovh.net:3000/chat', options: {} };
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    IonicRatingModule,
    HttpModule,
    BrowserAnimationsModule,
    PipesModule,
    LongPressModule,
    TimeAgoPipeModule,
    IonicImageViewerModule,
    BrowserModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    SocketIoModule.forRoot(config),
    IonicModule.forRoot(MyApp,{
      backButtonText:'',
      mode: 'md'
    }),
    IonicStorageModule.forRoot({name: 'onaTrouveDatadase'}),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAh30l0_YwqZkcgVBu-bWXylGO86IhaS84'
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    SocialSharing,
    StatusBar,
    UiProvider,
    Camera,
    Device,
    JwtHelperProvider,
    File,
    Push,
    Badge,
    EmailComposer,
    CallNumber,
    FileTransfer,
    BranchIo,
    FileTransferObject,
    CameraProvider,
    HttpHelperProvider,
    SplashScreen,
    Dialogs,
    LocationAccuracy,
    Geolocation,
    Media,
    BackgroundGeolocation,
    AndroidPermissions,
    Diagnostic,
    StorageProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServicesProvider,
    AppConfigProvider,
    UiProvider,
    AuthServiceProvider,
    PluginProvider,
  ]
})
export class AppModule {}
