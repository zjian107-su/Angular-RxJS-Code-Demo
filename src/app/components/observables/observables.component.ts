import { Component } from '@angular/core';
import {
  Observable,
  of,
  from,
  fromEvent,
  interval,
  timer,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-observables',
  template: `
    <h1>Observables</h1>
    <button
      (click)="observableSubscribe()"
      [ngStyle]="{ border: observableShow ? '1px solid red' : '' }"
    >
      Observable
    </button>
    <button
      (click)="ofSubscribe()"
      [ngStyle]="{ border: ofShow ? '1px solid red' : '' }"
    >
      Of
    </button>
    <button
      (click)="fromSubscribe()"
      [ngStyle]="{ border: fromShow ? '1px solid red' : '' }"
    >
      From
    </button>
    <button
      (click)="fromPromiseSubscribe()"
      [ngStyle]="{ border: fromPromiseShow ? '1px solid red' : '' }"
    >
      From Promise
    </button>
    <button
      (click)="fromEventSubscribe()"
      [ngStyle]="{ border: fromEventShow ? '1px solid red' : '' }"
    >
      From Event
    </button>
    <button
      (click)="intervalSubscribe()"
      [ngStyle]="{ border: intervalShow ? '1px solid red' : '' }"
    >
      Interval
    </button>
    <button
      (click)="timerSubscribe()"
      [ngStyle]="{ border: timerShow ? '1px solid red' : '' }"
    >
      Timer
    </button>

    <div>
      <!-- Observable -->
      <ng-container *ngIf="observableShow">
        <h3>Observable</h3>
        <p>Final value: {{ observableFinalValue }}</p>
        <p>All values: {{ observableAllValues | json }}</p>
      </ng-container>

      <!-- Of -->
      <ng-container *ngIf="ofShow">
        <h3>Of</h3>
        <p>Final value: {{ ofFinalValue }}</p>
        <p>All values: {{ ofAllValues | json }}</p>
      </ng-container>

      <!-- From -->
      <ng-container *ngIf="fromShow">
        <h3>From</h3>
        <p>Final value: {{ fromFinalValue }}</p>
        <p>All values: {{ fromAllValues | json }}</p>
      </ng-container>

      <!-- From a Promise -->
      <ng-container *ngIf="fromPromiseShow">
        <h3>From Promise</h3>
        <p>Final value: {{ fromPromiseFinalValue }}</p>
      </ng-container>

      <!-- FromEvent -->
      <ng-container *ngIf="fromEventShow">
        <h3>From Event</h3>
        <p>
          Client X: {{ fromEventValue.clientX }}
          <br />
          Client Y: {{ fromEventValue.clientY }}
        </p>
        <p>
          fromEvent is a <b>hot observable</b> because the data is produced
          outside of this observable which is the pointer position values in our
          case
        </p>
      </ng-container>

      <!-- Interval -->
      <ng-container *ngIf="intervalShow">
        <h3>Interval</h3>
        <p>Value: {{ intervalValue }}</p>
      </ng-container>

      <!-- Timer -->
      <ng-container *ngIf="timerShow">
        <h3>Timer</h3>
        <p>Value: {{ timerValue === null ? 'No Value Yet' : timerValue }}</p>
        <p>Time Start: {{ timeStart | date : 'medium' }}</p>
        <p>Time End: {{ timeEnd | date : 'medium' }}</p>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class ObservablesComponent {
  // Observable
  observableShow: boolean = false; // This is for showing and hiding the reuslts in the template
  observableFinalValue: number = 0; // This is for showing the final value of the observable in the template
  observableAllValues: number[] = []; // This is for showing all of the emitted values of the observable in the template
  observableSubscription: Subscription | null = null; // This is for unsubscribing and cleanup purposes
  observable = new Observable<number>((subscriber) => {
    subscriber.next(1); // Manually emit values using .next()
    subscriber.next(2);
    subscriber.next(3);
    subscriber.next(4);
    subscriber.next(5);
    // subscriber.error({ message: 'Error' }); // Manually throw error using .error()
    subscriber.complete(); // This is for marking the completion of emission
  });

observableSubscribe() {
    // This is the function used to subscribe to the observable and storing the values being emitted
    if (!this.observableShow) {
      this.observableShow = true; // Show the ng-container in the view
      this.observableSubscription = this.observable.subscribe({
        // subscribing to the observable
        next: (value) => {
          // next function is used to handle the emitted value
          this.observableFinalValue = value;
          this.observableAllValues.push(value);
        },
        error: (error) => {
          // error function is used to handle the error
          console.error(error);
        },
        complete: () => {
          // complete function is used to handle the completion of emmition
          console.log('Observable completed');
        },
      });
    } else {
      this.observableShow = false; // Hide the ng-container in the view
      this.observableSubscription!.unsubscribe(); // Unsubscribe from the observable
      this.observableFinalValue = 0; // Reset the final value
      this.observableAllValues = []; // Reset all emitted values
    }
  }

  // ==================
  // of
  ofShow: boolean = false;
  ofFinalValue: number = 0;
  ofAllValues: number[] = [];
  ofSubscription: Subscription | null = null;
  ofObservable: Observable<number> = of(1, 2, 3, 4, 5); // 'of' is a creation operator in RxJS that takes in values using comma-separated syntax

  ofSubscribe() {
    if (!this.ofShow) {
      this.ofShow = true;
      this.ofSubscription = this.ofObservable.subscribe({
        next: (value) => {
          this.ofFinalValue = value;
          this.ofAllValues.push(value);
        },
      });
    } else {
      this.ofShow = false;
      this.ofSubscription!.unsubscribe();
      this.ofFinalValue = 0;
      this.ofAllValues = [];
    }
  }

  // ==================
  // from
  fromShow: boolean = false;
  fromFinalValue: number = 0;
  fromAllValues: number[] = [];
  fromSubscription: Subscription | null = null;
  fromObservable: Observable<number> = from([1, 2, 3, 4, 5]); // 'from' is a creation operator in RxJS that takes in values using array syntax

  fromSubscribe() {
    if (!this.fromShow) {
      this.fromShow = true;
      this.fromSubscription = this.fromObservable.subscribe({
        next: (value) => {
          this.fromFinalValue = value;
          this.fromAllValues.push(value);
        },
      });
    } else {
      this.fromShow = false;
      this.fromSubscription!.unsubscribe();
      this.fromFinalValue = 0;
      this.fromAllValues = [];
    }
  }

  // ==================
  // from a promise
  fromPromiseShow: boolean = false;
  fromPromiseFinalValue: string = '';
  fromPromiseSubscription: Subscription | null = null;
  fromPromiseObservable: Observable<any> = from(
    new Promise((resolve) => {
      resolve('Promise resolved');
    }),
  ); // you can also pass in a promise to the 'from' operator

  fromPromiseSubscribe() {
    if (!this.fromPromiseShow) {
      this.fromPromiseShow = true;
      this.fromPromiseSubscription = this.fromPromiseObservable.subscribe({
        next: (value) => {
          this.fromPromiseFinalValue = value;
        },
      });
    } else {
      this.fromPromiseShow = false;
      this.fromPromiseSubscription!.unsubscribe();
      this.fromPromiseFinalValue = '';
    }
  }

  // ==================
  // fromEvent
  fromEventShow: boolean = false;
  fromEventValue: { clientX: number; clientY: number } = {
    clientX: 0,
    clientY: 0,
  }; // define the inital values for the position of the mouse click
  fromEventSubscription: Subscription | null = null;
  fromEventObservable: Observable<MouseEvent> = fromEvent<MouseEvent>(
    document,
    'click',
  ); // 'fromEvent' is a creation operator in RxJS that creates an observable from DOM events

  fromEventSubscribe() {
    if (!this.fromEventShow) {
      this.fromEventShow = true;
      this.fromEventSubscription = this.fromEventObservable.subscribe({
        next: (event: MouseEvent) => {
          // notice here the value being emitted is a MouseEvent
          this.fromEventValue = {
            clientX: event.clientX,
            clientY: event.clientY,
          };
        },
      });
    } else {
      this.fromEventShow = false;
      this.fromEventSubscription!.unsubscribe();
      this.fromEventValue = {
        clientX: 0,
        clientY: 0,
      };
    }
  }

  // ==================
  // interval
  intervalShow: boolean = false;
  intervalValue: number = 0;
  intervalSubscription: Subscription | null = null;
  intervalObservable: Observable<number> = interval(1000); // 'interval' is a creation operator in RxJS that creates an observable that emits an auto-incremented value starting from 0 based on the time in milliseconds that we passed in. In our case, it will emit a value every 1000ms starting from 0.

  intervalSubscribe() {
    if (!this.intervalShow) {
      this.intervalShow = true;
      this.intervalSubscription = this.intervalObservable.subscribe({
        next: (value) => {
          this.intervalValue = value;
        },
      });
    } else {
      this.intervalShow = false;
      this.intervalSubscription!.unsubscribe();
      this.intervalValue = 0;
    }
  }

  // ==================
  // timer
  timerShow: boolean = false;
  timerValue: number | null = null;
  timerSubscription: Subscription | null = null;
  timeStart: Date | null = null;
  timeEnd: Date | null = null;
  timerObservable: Observable<number> = timer(2000); // 'timer' is a creation operator in RxJS that creates an observable that emits the value 0 after a certain amount of time has passed. In our case, it will emit 0 after 2 seconds.

  timerSubscribe() {
    if (!this.timerShow) {
      this.timerShow = true;
      console.time('timer'); // This is a logging function that will be used to measure the time it takes to complete the observable
      this.timeStart = new Date(); // This is used to store the time the observable started
      this.timerSubscription = this.timerObservable.subscribe({
        next: (value) => {
          this.timerValue = value;
          console.timeEnd('timer'); // This is a logging function that will be used to measure the time it takes to complete the observable
          this.timeEnd = new Date(); // This is used to store the time the observable ended
        },
      });
    } else {
      this.timerShow = false;
      this.timerSubscription!.unsubscribe();
      this.timerValue = null;
      this.timeStart = null;
      this.timeEnd = null;
    }
  }
}
