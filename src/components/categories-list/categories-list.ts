import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Events } from 'ionic-angular';
import { ApiServicesProvider } from '../../providers/api-services/api-services';

@Component({
  selector: 'categories-list',
  templateUrl: 'categories-list.html',
})
export class CategoriesListComponent {
  contentHeight = null;
  innerMaxHeight = null;
  maxHeight = 0;
  categories: any = []
  @Output() onCategoryClick: EventEmitter<any> = new EventEmitter();
  @ViewChild("content", { read: ElementRef }) content: ElementRef;
  _isVisible
  @Input() set isVisible(val) {
    if (val != this._isVisible) {
      this._isVisible = val
      this.toggleState()
    }
  }
  constructor(private events: Events, private services: ApiServicesProvider) {
    this.events.unsubscribe('onMenuOpen')
    this.events.subscribe('onMenuOpen', ()=> {
      this.initComponent();
    })
    this.getCategories()
  }

  getCategories() {
    this.services.getCategories().then((res: any) => {
      this.categories = res;
    }).catch((err: any) => {
      this.services.fireError(err);
      this.categories = [];
    })
  }

  initComponent() {
    this.contentHeight = this.content.nativeElement.clientHeight;
    this.innerMaxHeight = this.maxHeight;
    this.toggleState()
  }

  showSubcategories(category) {
    this.onCategoryClick.emit(category)
  }

  toggleState() {
    if (this._isVisible) {
      this.content.nativeElement.style.height = `${this.contentHeight}px`;
    }else {
      this.content.nativeElement.style.height = `${this.innerMaxHeight}px`;
    }
  }

}
