import { NgModule } from '@angular/core';
import { GroupByDaysPipe } from './group-by-days/group-by-days';
import { DateFormatPipe } from './date-format/date-format';
@NgModule({
	declarations: [GroupByDaysPipe,
    DateFormatPipe],
	imports: [],
	exports: [GroupByDaysPipe,
    DateFormatPipe]
})
export class PipesModule {}
