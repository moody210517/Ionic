import { Pipe } from '@angular/core';
import { DateFormatPipe } from '../date-format/date-format';

@Pipe({
    name: "groupByDays",
})

export class GroupByDaysPipe {
    dateFormat = new DateFormatPipe
    transform( collection: Object[] , term: string ) {

        let newValue = [];
        for (let i = 0; i < collection.length; i++) {
            let keyVal = GroupByDaysPipe.deepFind(collection[i], term);
            keyVal = this.formatedDate(keyVal);
            const index = newValue.findIndex( myObj => myObj.key == keyVal);
            if (index >= 0) {
                newValue[index].value.push(collection[i]);
            } else {
                newValue.push({key: keyVal, value: [collection[i]]});
            }
        }

        return newValue;

    }

    formatedDate(date) {
        return this.dateFormat.transform(date, 'dd-MM-yyyy')
    }

    fixDate(date) {
        if (typeof(date) == 'string') {
            return new Date(date.replace(/-/g, "/"))
        }else {
            return date
        }
    }

    static deepFind(obj, path) {

        var paths = path.toString().split(/[\.\[\]]/);
        var current = obj;

        for (let i = 0; i < paths.length; ++i) {
            if (paths[i] !== "") {
                if (current[paths[i]] == undefined) {
                    return undefined;
                } else {
                    current = current[paths[i]];
                }
            }
        }
        return current;

    }

}