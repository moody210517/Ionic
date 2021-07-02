import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO, toDate } from 'date-fns';


@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {

  transform(date: any, DFormat = 'dd-MM-yyyy') {
    const newDate = typeof(date) == 'string' ? parseISO(date) : date
    return format(toDate(newDate), DFormat);
  }

}
