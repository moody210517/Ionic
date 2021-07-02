import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPikkerPage } from './map-pikker';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    MapPikkerPage,
  ],
  imports: [
    IonicPageModule.forChild(MapPikkerPage),
    AgmCoreModule
  ],
})
export class MapPikkerPageModule {}
