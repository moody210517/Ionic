import { PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from "@angular/core";
export declare class TimeAgoPipe implements PipeTransform, OnDestroy {
    private changeDetectorRef;
    private ngZone;
    private timer;
    constructor(changeDetectorRef: ChangeDetectorRef, ngZone: NgZone);
    transform(value: string,langue): string;
    ngOnDestroy(): void;
    private removeTimer();
    private getSecondsUntilUpdate(seconds);
}
