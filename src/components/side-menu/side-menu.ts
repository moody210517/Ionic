import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { Content, Events } from 'ionic-angular';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent {
  @Input() content: Content
  @Input() side: 'left'|'right' = 'left'
  @Output() onFireMethod: EventEmitter<{method: string, params: any}> = new EventEmitter
  showrow = true
  constructor(public services: ApiServicesProvider, private events: Events) {
  }

  fireMethod(method, params?) {
    this.onFireMethod.emit({method, params})
  }

  onOpen() {
    this.events.publish('onMenuOpen')
  }

}
