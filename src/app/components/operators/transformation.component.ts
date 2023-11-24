import { Component } from '@angular/core';
import {
  interval,
  take,
  map,
  concatMap,
  exhaustMap,
  mergeMap,
  switchMap,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-transformation',
  template: `
    <h2>Transformation Operators</h2>
    <button
      (click)="concatMapSubscribe()"
      [ngStyle]="{ border: concatMapShow ? '1px solid red' : '' }"
    >
      Concat Map
    </button>
    <button
      (click)="exhaustMapSubscribe()"
      [ngStyle]="{ border: exhaustMapShow ? '1px solid red' : '' }"
    >
      Exhaust Map
    </button>
    <button
      (click)="mergeMapSubscribe()"
      [ngStyle]="{ border: mergeMapShow ? '1px solid red' : '' }"
    >
      Merge Map
    </button>
    <button
      (click)="switchMapSubscribe()"
      [ngStyle]="{ border: switchMapShow ? '1px solid red' : '' }"
    >
      Switch Map
    </button>

    <div>
      <ng-container *ngIf="concatMapShow">
        <h3>Concat Map</h3>
        <div *ngFor="let value of concatMapValues">{{ value }}</div>
      </ng-container>

      <ng-container *ngIf="exhaustMapShow">
        <h3>Exhaust Map</h3>
        <div *ngFor="let value of exhaustMapValues">{{ value }}</div>
      </ng-container>

      <ng-container *ngIf="mergeMapShow">
        <h3>Merge Map</h3>
        <div *ngFor="let value of mergeMapValues">{{ value }}</div>
      </ng-container>

      <ng-container *ngIf="switchMapShow">
        <h3>Switch Map</h3>
        <div *ngFor="let value of switchMapValues">{{ value }}</div>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class TransformationComponent {
  // https://thinkrx.io/rxjs/mergeMap-vs-exhaustMap-vs-switchMap-vs-concatMap/
  interval = interval(500).pipe(take(3));

  // concatMap
  concatMapShow: boolean = false;
  concatMapSubscription: Subscription | null = null;
  concatMapValues: string[] = [];
  concatMapObservable = this.interval.pipe(
    concatMap((outer) =>
      interval(300).pipe(
        take(3),
        map((inner) => outer + String.fromCharCode(inner + 97)),
      ),
    ),
  ); // You can understand 'concatMap' as a combination of 'concat' and 'map'.
  // In our case, we are mapping the three values (0, 1, 2) being emitted by the outer interval into an inner interval that emits three values (a, b, c), and then concatenating all emitted values together.
  // 0a --- 800ms // initial value emits at 800ms because outer interval emits at 500ms and inner interval emits at 300ms
  // 0b --- 1100ms
  // 0c --- 1400ms
  // 1a --- 1700ms // value 1a is emitted at 1700ms but not at 1300ms because with concatMap, the emission of the next observable only starts when the previous observable is completed.
  // 1b --- 2000ms
  // 1c --- 2300ms
  // 2a --- 2600ms
  // 2b --- 2900ms
  // 2c --- 3200ms

  concatMapSubscribe() {
    if (!this.concatMapShow) {
      this.concatMapShow = true;
      const startTime = new Date().getTime();
      this.concatMapSubscription = this.concatMapObservable.subscribe({
        next: (value) => {
          const endTime = new Date().getTime();
          this.concatMapValues.push(
            `${value} --- ${Math.floor((endTime - startTime) / 100) * 100}ms`,
          );
        },
      });
    } else {
      this.concatMapShow = false;
      this.concatMapSubscription!.unsubscribe();
      this.concatMapValues = [];
    }
  }

  // ==================
  // exhaustMap
  exhaustMapShow: boolean = false;
  exhaustMapSubscription: Subscription | null = null;
  exhaustMapValues: string[] = [];
  exhaustMapObservable = this.interval.pipe(
    exhaustMap(
      // Similar logic here, but used 'exhaustMap' instead of 'concatMap'
      (outer) =>
        interval(300).pipe(
          take(3),
          map((inner) => outer + String.fromCharCode(inner + 97)),
        ),
    ),
  );
  // For exhaustMap, if the next observable starts to emit before the previous observable is completed, the next observable's values will be ignored
  // 0a --- 800ms
  // 0b --- 1100ms
  // 0c --- 1400ms // no values for the second observable (1a, 1b, 1c) because it is supposed to start at 1300ms, but the previous observable finished at 1400ms which is later than 1300ms, so the second observable is ignored
  // 2a --- 1800ms
  // 2b --- 2100ms
  // 2c --- 2400ms

  exhaustMapSubscribe() {
    if (!this.exhaustMapShow) {
      this.exhaustMapShow = true;
      const startTime = new Date().getTime();
      this.exhaustMapSubscription = this.exhaustMapObservable.subscribe({
        next: (value) => {
          const endTime = new Date().getTime();
          this.exhaustMapValues.push(
            `${value} --- ${Math.floor((endTime - startTime) / 100) * 100}ms`,
          );
        },
      });
    } else {
      this.exhaustMapShow = false;
      this.exhaustMapSubscription!.unsubscribe();
      this.exhaustMapValues = [];
    }
  }

  // ==================
  // mergeMap
  mergeMapShow: boolean = false;
  mergeMapSubscription: Subscription | null = null;
  mergeMapValues: string[] = [];
  mergeMapObservable = this.interval.pipe(
    mergeMap((outer) =>
      interval(300).pipe(
        take(3),
        map((inner) => outer + String.fromCharCode(inner + 97)),
      ),
    ),
  );
  // mergeMap will receive all values from all observables while preserving the emission order and time, you can think of it as 'merge' and 'map' used together
  // 0a --- 800ms
  // 0b --- 1100ms
  // 1a --- 1300ms
  // 0c --- 1400ms
  // 1b --- 1600ms
  // 2a --- 1800ms
  // 1c --- 1900ms
  // 2b --- 2100ms
  // 2c --- 2400ms

  mergeMapSubscribe() {
    if (!this.mergeMapShow) {
      this.mergeMapShow = true;
      const startTime = new Date().getTime();
      this.mergeMapSubscription = this.mergeMapObservable.subscribe({
        next: (value) => {
          const endTime = new Date().getTime();
          this.mergeMapValues.push(
            `${value} --- ${Math.floor((endTime - startTime) / 100) * 100}ms`,
          );
        },
      });
    } else {
      this.mergeMapShow = false;
      this.mergeMapSubscription!.unsubscribe();
      this.mergeMapValues = [];
    }
  }

  // ==================
  // switchMap
  switchMapShow: boolean = false;
  switchMapSubscription: Subscription | null = null;
  switchMapValues: string[] = [];
  switchMapObservable = this.interval.pipe(
    switchMap((outer) =>
      interval(300).pipe(
        take(3),
        map((inner) => outer + String.fromCharCode(inner + 97)),
      ),
    ),
  );
  // with switchMap, if the first observable isn't completed, and the second observable starts to emit values, it will unsubscribe from the first observable and switch to the second observable.
  // 0a --- 800ms
  // 1a --- 1300ms // there is no '0b, 0c' because the second value (1) of the outer observable starts at 1000ms, so switchMap switched to the second value, and waited another 300ms for the inner observable to emit '1a', so the final emission time for '1a' is at 1300ms.
  // 2a --- 1800ms // Similar logic here, the third value (2) of the outer observable starts at 1500ms, and waited another 300ms for the inner observable
  // 2b --- 2100ms
  // 2c --- 2400ms

  switchMapSubscribe() {
    if (!this.switchMapShow) {
      this.switchMapShow = true;
      const startTime = new Date().getTime();
      this.switchMapSubscription = this.switchMapObservable.subscribe({
        next: (value) => {
          const endTime = new Date().getTime();
          this.switchMapValues.push(
            `${value} --- ${Math.floor((endTime - startTime) / 100) * 100}ms`,
          );
        },
      });
    } else {
      this.switchMapShow = false;
      this.switchMapSubscription!.unsubscribe();
      this.switchMapValues = [];
    }
  }
}
