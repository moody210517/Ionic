"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var TimeAgoPipe = (function () {
    function TimeAgoPipe(changeDetectorRef, ngZone) {
        this.changeDetectorRef = changeDetectorRef;
        this.ngZone = ngZone;
    }
    TimeAgoPipe.prototype.transform = function (value,langue) {
        var _this = this;
        this.removeTimer();
        var d = new Date(value);
        var now = new Date();
        var seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
        var timeToUpdate = this.getSecondsUntilUpdate(seconds) * 1000;
        this.timer = this.ngZone.runOutsideAngular(function () {
            if (typeof window !== 'undefined') {
                return window.setTimeout(function () {
                    _this.ngZone.run(function () { return _this.changeDetectorRef.markForCheck(); });
                }, timeToUpdate);
            }
            return null;
        });
        var minutes = Math.round(Math.abs(seconds / 60));
        var hours = Math.round(Math.abs(minutes / 60));
        var days = Math.round(Math.abs(hours / 24));
        var months = Math.round(Math.abs(days / 30.416));
        var years = Math.round(Math.abs(days / 365));
        if (seconds <= 45) {
            switch(langue){
                case 'ar':return 'منذ ثوان';
                case 'en': return 'a few seconds ago';
                case 'fr':return 'il ya quelques secondes';
            }
           
        }
        else if (seconds <= 90) {
             switch(langue){
                case 'ar':return 'منذ دقيقة';
                case 'en': return 'a minute ago';
                case 'fr':return 'Il y\'a une minute';
            }
        }
        else if (minutes <= 45) {
            switch(langue){
                case 'ar':return 'منذ '+minutes+' دقائق';
                default:  return minutes + ' minutes';
              
            }
        }
        else if (minutes <= 90) {
             switch(langue){
                case 'ar':return 'منذ ساعة';
                case 'en': return 'an hour ago';
                case 'fr':return 'Il y\'a une heure';
            }
        }
        else if (hours <= 22) {
              switch(langue){
                case 'ar':return 'منذ '+hours+' ساعات';
                case 'en':return hours + ' hours';
                case 'fr':return hours + ' heures';
            }
            
        }
        else if (hours <= 36) {
              switch(langue){
                case 'ar':return 'منذ يوم';
                case 'en': return 'a day ago';
                case 'fr':return 'Il y\'a un jour';
            }
        }
        else {
            return d.toLocaleString(langue+'-u-nu-latn',{day:'numeric', month: "short",year:'numeric',hour: "numeric",minute:'numeric'});//,hour12:false to print hour24
        }
    };
    TimeAgoPipe.prototype.ngOnDestroy = function () {
        this.removeTimer();
    };
    TimeAgoPipe.prototype.removeTimer = function () {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    };
    TimeAgoPipe.prototype.getSecondsUntilUpdate = function (seconds) {
        var min = 60;
        var hr = min * 60;
        var day = hr * 24;
        if (seconds < min) {
            return 2;
        }
        else if (seconds < hr) {
            return 30;
        }
        else if (seconds < day) {
            return 300;
        }
        else {
            return 3600;
        }
    };
    return TimeAgoPipe;
}());
TimeAgoPipe = __decorate([
    core_1.Pipe({
        name: 'timeAgo',
        pure: false
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef, core_1.NgZone])
], TimeAgoPipe);
exports.TimeAgoPipe = TimeAgoPipe;
//# sourceMappingURL=time-ago-pipe.js.map