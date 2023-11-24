import { Component } from '@angular/core';
import {
  of,
  debounceTime,
  elementAt,
  filter,
  first,
  last,
  throttleTime,
  Subscription,
  fromEvent,
  interval,
} from 'rxjs';

@Component({
  selector: 'app-filtering',
  template: `
    <h2>Filtering Operators</h2>
    <button
      (click)="filterSubscribe()"
      [ngStyle]="{ border: filterShow ? '1px solid red' : '' }"
    >
      filter
    </button>
    <button
      (click)="firstLastSubscribe()"
      [ngStyle]="{ border: firstLastShow ? '1px solid red' : '' }"
    >
      first/last
    </button>
    <button
      (click)="elementAtSubscribe()"
      [ngStyle]="{ border: elementAtShow ? '1px solid red' : '' }"
    >
      elementAt
    </button>
    <button
      (click)="debounceTimeSubscribe()"
      [ngStyle]="{ border: debounceTimeShow ? '1px solid red' : '' }"
    >
      debounceTime
    </button>
    <button
      (click)="throttleTimeSubscribe()"
      [ngStyle]="{ border: throttleTimeShow ? '1px solid red' : '' }"
    >
      throttleTime
    </button>

    <div>
      <ng-container *ngIf="filterShow">
        <h3>Filter</h3>
        <p>Filter Values: {{ filterValues | json }}</p>
      </ng-container>

      <ng-container *ngIf="firstLastShow">
        <h3>First/Last</h3>
        <p>First Value: {{ firstValue }}</p>
        <p>Last Value: {{ lastValue }}</p>
      </ng-container>

      <ng-container *ngIf="elementAtShow">
        <h3>ElementAt</h3>
        <p>Element At 5 Value: {{ elementAtValue }}</p>
      </ng-container>

      <ng-container *ngIf="debounceTimeShow">
        <h3>DebounceTime</h3>
        <p>Click Anywhere!</p>
        <p>Actual number of clicks: {{ normalClickValue }}</p>
        <p>Debounced number of clicks: {{ debounceTimeValue }}</p>
      </ng-container>

      <ng-container *ngIf="throttleTimeShow">
        <h3>ThrottleTime</h3>
        <div *ngFor="let value of throttleTimeValues">
          {{ value }}
        </div>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class FilteringComponent {
  observable = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

  // filter
  filterShow: boolean = false;
  filterValues: number[] = [];
  filterSubscription: Subscription | null = null;
  filterObservable = this.observable.pipe(filter((x) => x % 2 === 0)); // checking if the emitted value is an even number, and only include the even numbers

  filterSubscribe() {
    if (!this.filterShow) {
      this.filterShow = true;
      this.filterSubscription = this.filterObservable.subscribe({
        next: (value) => {
          this.filterValues.push(value);
        },
      });
    } else {
      this.filterShow = false;
      this.filterValues = [];
      this.filterSubscription!.unsubscribe();
    }
  }

  // ==================
  // first/last
  firstLastShow: boolean = false;
  firstValue: number | null = null;
  lastValue: number | null = null;
  firstSubscription: Subscription | null = null;
  lastSubscription: Subscription | null = null;
  firstObservable = this.observable.pipe(first()); // get the first value of all emitted values
  lastObservable = this.observable.pipe(last()); // get the last value of all emitted values

  firstLastSubscribe() {
    if (!this.firstLastShow) {
      this.firstLastShow = true;
      this.firstSubscription = this.firstObservable.subscribe({
        next: (value) => {
          this.firstValue = value;
        },
      });
      this.lastSubscription = this.lastObservable.subscribe({
        next: (value) => {
          this.lastValue = value;
        },
      });
    } else {
      this.firstLastShow = false;
      this.firstValue = null;
      this.lastValue = null;
      this.firstSubscription!.unsubscribe();
      this.lastSubscription!.unsubscribe();
    }
  }

  // ==================
  // elementAt
  elementAtShow: boolean = false;
  elementAtValue: number | null = null;
  elementAtSubscription: Subscription | null = null;
  elementAtObservable = this.observable.pipe(elementAt(5)); // get the value of the element at the index passed into it

  elementAtSubscribe() {
    if (!this.elementAtShow) {
      this.elementAtShow = true;
      this.elementAtSubscription = this.elementAtObservable.subscribe({
        next: (value) => {
          this.elementAtValue = value;
        },
      });
    } else {
      this.elementAtShow = false;
      this.elementAtValue = null;
      this.elementAtSubscription!.unsubscribe();
    }
  }

  // ==================
  // debounceTime
  debounceTimeShow: boolean = false;
  debounceTimeValue: number = 0;
  debounceTimeSubscription: Subscription | null = null;
  debounceTimeObservable = fromEvent(document, 'click').pipe(
    debounceTime(1000), // debounceTime means that, after receiving a value (in our case, a pointer click event), we will wait 1000ms and then emit that event, if during this 1000ms we clicked again, the timer will reset to 1000ms and ignore all clicks happened during the wait time.
  );
  normalClickValue: number = 0;
  normalClickSubscription: Subscription | null = null;
  normalClickObservable = fromEvent(document, 'click'); // This is just for keeping the count of the actual number of clicks we performed.

  debounceTimeSubscribe() {
    if (!this.debounceTimeShow) {
      this.debounceTimeShow = true;
      this.debounceTimeSubscription = this.debounceTimeObservable.subscribe({
        next: () => {
          this.debounceTimeValue++;
        },
      });
      this.normalClickSubscription = this.normalClickObservable.subscribe({
        next: () => {
          this.normalClickValue++;
        },
      });
    } else {
      this.debounceTimeShow = false;
      this.debounceTimeValue = 0;
      this.debounceTimeSubscription!.unsubscribe();
      this.normalClickSubscription!.unsubscribe();
      this.normalClickValue = 0;
    }
  }

  // ==================
  // throttleTime
  throttleTimeShow: boolean = false;
  throttleTimeValues: string[] = [];
  throttleTimeSubscription: Subscription | null = null;
  throttleTimeObservable = interval(500).pipe(throttleTime(900)); // throttleTime means that, after emitting a value, we have to wait for a specific amount of time (in our case, 900ms) before we can emit the next value.
  // 0 --- 500ms // value '1' should be emitted at 1000ms, but because we have to wait for 900ms, that means we cannot emit new values until 500 + 900 = 1400ms, so '1' is ignored
  // 2 --- 1500ms
  // 4 --- 2500ms
  // 6 --- 3500ms
  // ......

  // The difference between debounceTime and throttleTime is that, when we emit a value,
  // for debounceTime, we have to wait for the debounced duration and then emit it,
  // for throttleTime, the value will be emitted right away as long as we are not in the throttled time period

  throttleTimeSubscribe() {
    if (!this.throttleTimeShow) {
      this.throttleTimeShow = true;
      const startTime = new Date().getTime();
      this.throttleTimeSubscription = this.throttleTimeObservable.subscribe({
        next: (value) => {
          const endTime = new Date().getTime();
          this.throttleTimeValues.push(
            `${value} --- ${Math.floor((endTime - startTime) / 100) * 100}ms`,
          );
        },
      });
    } else {
      this.throttleTimeShow = false;
      this.throttleTimeValues = [];
      this.throttleTimeSubscription!.unsubscribe();
    }
  }
}
