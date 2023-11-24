import { Component } from '@angular/core';
import {
  interval,
  take,
  concat,
  merge,
  forkJoin,
  Subscription,
  map,
} from 'rxjs';

@Component({
  selector: 'app-join-creation',
  template: `
    <h2>Join Creation Operators</h2>
    <button
      (click)="concatSubscribe()"
      [ngStyle]="{ border: concatShow ? '1px solid red' : '' }"
    >
      Concat
    </button>
    <button
      (click)="mergeSubscribe()"
      [ngStyle]="{ border: mergeShow ? '1px solid red' : '' }"
    >
      Merge
    </button>
    <button
      (click)="forkJoinSubscribe()"
      [ngStyle]="{ border: forkJoinShow ? '1px solid red' : '' }"
    >
      Fork Join
    </button>

    <div>
      <!-- Concat -->
      <ng-container *ngIf="concatShow">
        <h3>Concat</h3>
        <div *ngFor="let value of concatValues">{{ value }}</div>
      </ng-container>

      <!-- Merge -->
      <ng-container *ngIf="mergeShow">
        <h3>Merge</h3>
        <div *ngFor="let value of mergeValues">{{ value }}</div>
      </ng-container>

      <!-- Fork Join -->
      <ng-container *ngIf="forkJoinShow">
        <h3>Fork Join</h3>
        <div>{{ forkJoinValue }}</div>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class JoinCreationComponent {
  interval1 = interval(1000).pipe(take(3)); // we create an observable using the interval operator on a 1 second interval, and we use the 'take' operator to only take 3 values from this interval observable
  interval2 = interval(500).pipe(
    take(3), // take 3 values from this interval observable that emits a value every 0.5 seconds
    map((value) => String.fromCharCode(97 + value)), // map each value (0, 1, 2) to (a, b, c)
  );

  // concat
  concatShow: boolean = false;
  concatSubscription: Subscription | null = null;
  concatValues: string[] = [];
  concatObservable = concat(this.interval1, this.interval2); // 'concat' is a join-creation operator, it concatenates 2 or more observables' values according to the order in which they are passed to it. In this case, although interval1 starts to emit values later than interval2, we still receive interval1's values first because it is being passed as the first argument.
  // 0 --- 1000ms
  // 1 --- 2000ms
  // 2 --- 3000ms
  // a --- 3500ms
  // b --- 4000ms
  // c --- 4500ms

  concatSubscribe() {
    if (!this.concatShow) {
      this.concatShow = true;
      const startTime = new Date().getTime();
      this.concatSubscription = this.concatObservable.subscribe({
        next: (value) => {
          const endTime = new Date().getTime();
          this.concatValues.push(
            `${value} --- ${Math.floor((endTime - startTime) / 100) * 100}ms`,
            // Just to show the value as well as the time of emission rounded to the nearest hundreds
          );
        },
      });
    } else {
      this.concatShow = false;
      this.concatSubscription!.unsubscribe();
      this.concatValues = [];
    }
  }

  // ==================
  // merge
  mergeShow: boolean = false;
  mergeSubscription: Subscription | null = null;
  mergeValues: string[] = [];
  mergeObservable = merge(this.interval1, this.interval2); // 'merge' is used to merge the values of each of the observables being passed into it and preserving the order of emission for each observable
  // a --- 500ms
  // 0 --- 1000ms
  // b --- 1000ms
  // c --- 1500ms
  // 1 --- 2000ms
  // 2 --- 3000ms

  mergeSubscribe() {
    if (!this.mergeShow) {
      this.mergeShow = true;
      const startTime = new Date().getTime();
      this.mergeSubscription = this.mergeObservable.subscribe({
        next: (value) => {
          const endTime = new Date().getTime();
          this.mergeValues.push(
            `${value} --- ${Math.floor((endTime - startTime) / 100) * 100}ms`,
          );
        },
      });
    } else {
      this.mergeShow = false;
      this.mergeSubscription!.unsubscribe();
      this.mergeValues = [];
    }
  }

  // ==================
  // forkJoin
  forkJoinShow: boolean = false;
  forkJoinSubscription: Subscription | null = null;
  forkJoinValue: string = '';
  forkJoinObservable = forkJoin([this.interval1, this.interval2]); // 'forkJoin' takes in an array of observables, and emits the final values of each observable as an array after all observables have completed. Similar to how Promise.all() behaves.
  // [2,"c"] --- 3000ms

  forkJoinSubscribe() {
    if (!this.forkJoinShow) {
      this.forkJoinShow = true;
      const startTime = new Date().getTime();
      this.forkJoinSubscription = this.forkJoinObservable.subscribe({
        next: (value) => {
          const endTime = new Date().getTime();
          this.forkJoinValue = `${JSON.stringify(value)} --- ${
            Math.floor((endTime - startTime) / 100) * 100
          }ms`;
        },
      });
    } else {
      this.forkJoinShow = false;
      this.forkJoinSubscription!.unsubscribe();
      this.forkJoinValue = ``;
    }
  }
}
