import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { AppConfigProvider } from "../../providers/app-config/app-config";
import { toDate, parseISO } from 'date-fns';
@Pipe({
    name: 'timeAgo',
    pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
    private timer: number;
    constructor(private changeDetectorRef: ChangeDetectorRef, private appconfig: AppConfigProvider, private ngZone: NgZone) { }
    transform(value: string, langue: string = 'en') {
        langue = this.appconfig.userSettings.language;
        this.removeTimer();
        let d = toDate(parseISO(value));
        let now = new Date();
        let seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
        let timeToUpdate = this.getSecondsUntilUpdate(seconds) * 1000;
        this.timer = this.ngZone.runOutsideAngular(() => {
            if (typeof window !== 'undefined') {
                return window.setTimeout(() => {
                    this.ngZone.run(() => this.changeDetectorRef.markForCheck());
                }, timeToUpdate);
            }
            return null;
        });
        let minutes = Math.round(Math.abs(seconds / 60));
        let hours = Math.round(Math.abs(minutes / 60));
        let days = Math.round(Math.abs(hours / 24));
        let months = Math.round(Math.abs(days / 30.416));
        let years = Math.round(Math.abs(days / 365));
        if (seconds <= 45) {
            switch (langue) {
                case 'ar': return 'منذ ثوان';
                case 'en': return 'sec(s)';
                case 'fr': return 'sec(s)';
            }

        }
        else if (seconds <= 90) {
            switch (langue) {
                case 'ar': return 'منذ دقيقة';
                case 'en': return '1 min';
                case 'fr': return '1 min';
            }
        }
        else if (minutes <= 45) {
            switch (langue) {
                case 'ar': return 'منذ ' + minutes + ' دقائق';
                default: return minutes + 'min';

            }
        }
        else if (minutes <= 90) {
            switch (langue) {
                case 'ar': return 'منذ ساعة';
                case 'en': return '1 h';
                case 'fr': return '1 h';
            }
        }
        else if (hours <= 22) {
            switch (langue) {
                case 'ar': return 'منذ ' + hours + ' ساعات';
                case 'en': return hours + ' h';
                case 'fr': return hours + ' h';
            }

        }
        else if (hours <= 36) {
            switch (langue) {
                case 'ar': return 'منذ يوم';
                case 'en': return '1 day';
                case 'fr': return '1 jour';
            }
        } else if (days <= 25) {
            switch (langue) {
                case 'ar': return days + ' يوم';
                case 'en': return days + ' days';
                case 'fr': return days + ' jours';
            }
        }
        else if (days <= 45) {
            switch (langue) {
                case 'ar': return 'شهر';
                case 'en': return '1 month';
                case 'fr': return '1 mois';
            }
        }
        else if (days <= 345) {
            switch (langue) {
                case 'ar': return months + ' أشهر';
                case 'en': return months + ' months';
                case 'fr': return months + ' mois';
            }
        }
        else if (days <= 545) {
            switch (langue) {
                case 'ar': return '1 سنة';
                case 'en': return '1 year';
                case 'fr': return '1 ans';
            }
        }
        else {
            // (days > 545)
            switch (langue) {
                case 'ar': return years + ' سنة';
                case 'en': return years + ' years';
                case 'fr': return years + ' ans';
            }
        }
    }

    ngOnDestroy(): void {
        this.removeTimer();
    }
    private removeTimer() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }
    private getSecondsUntilUpdate(seconds: number) {
        let min = 60;
        let hr = min * 60;
        let day = hr * 24;
        if (seconds < min) { // less than 1 min, update ever 2 secs
            return 2;
        } else if (seconds < hr) { // less than an hour, update every 30 secs
            return 30;
        } else if (seconds < day) { // less then a day, update every 5 mins
            return 300;
        } else { // update every hour
            return 3600;
        }
    }
}