import { NgModule } from '@angular/core';
import { CategoriesListComponent } from './categories-list/categories-list';
import { IonicModule } from 'ionic-angular';
import { SideMenuComponent } from './side-menu/side-menu';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
	declarations: [CategoriesListComponent,
    SideMenuComponent],
	imports: [
		IonicModule,
		TranslateModule.forChild()
	],
	exports: [CategoriesListComponent,
    SideMenuComponent]
})
export class ComponentsModule {}
