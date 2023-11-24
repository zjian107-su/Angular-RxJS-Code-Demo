import { Component } from '@angular/core';
import { of, catchError, retry, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-error-handling',
  template: `
    <h2>Error Handling Operators</h2>
    <button
      (click)="catchErrorSubscribe()"
      [ngStyle]="{ border: showCatchError ? '1px solid red' : '' }"
    >
      Catch Error
    </button>
    <button
      (click)="retrySubscribe()"
      [ngStyle]="{ border: showRetry ? '1px solid red' : '' }"
    >
      Retry
    </button>

    <div>
      <ng-container *ngIf="showCatchError">
        <p>Catch Error Values: {{ catchErrorValues | json }}</p>
      </ng-container>

      <ng-container *ngIf="showRetry">
        <p>Retry Values: {{ retryValues | json }}</p>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class ErrorHandlingComponent {
  // catchError
  showCatchError = false;
  catchErrorValues: Array<number | string> = [];
  catchErrorSubscription: Subscription | null = null;
  catchErrorObservable = of(1, 2, 3, 4, 5).pipe(
    map((num) => {
      if (num === 4) {
        throw 'Error'; // explictly throw an error here, the error will be catched by the catchError operator.
      }
      return num;
    }),
    catchError((err) => {
      // throw err; // we can throw the error here, and this will be caught by the error() function in the .subscribe() method
      return of(err); // or we can return the error as an observable, then the error will be handled by the next() function in the .subscribe() method
    }),
  );

  catchErrorSubscribe() {
    if (!this.showCatchError) {
      this.showCatchError = true;
      this.catchErrorSubscription = this.catchErrorObservable.subscribe({
        next: (value) => {
          this.catchErrorValues.push(value);
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.showCatchError = false;
      this.catchErrorSubscription!.unsubscribe();
      this.catchErrorValues = [];
    }
  }

  // ==================
  // retry
  showRetry = false;
  retryValues: Array<number | string> = [];
  retrySubscription: Subscription | null = null;
  retryObservable = of(1, 2, 3, 4, 5).pipe(
    map((num) => {
      if (num === 4) {
        throw 'Error';
      }
      return num;
    }),
    retry(2), // 'retry' operator means that, if there's an error during emission, we retry the entire observable twice (you can think of it as re-subscribing to the same observable twice). After we retried it for the specified number of times, and the error still persists, it will finally throw the error. [ 1, 2, 3, 1, 2, 3, 1, 2, 3, "Error" ]
  );

  retrySubscribe() {
    if (!this.showRetry) {
      this.showRetry = true;
      this.retrySubscription = this.retryObservable.subscribe({
        next: (value) => {
          this.retryValues.push(value);
        },
        error: (err) => {
          console.error(err);
          this.retryValues.push(err);
        },
      });
    } else {
      this.showRetry = false;
      this.retrySubscription!.unsubscribe();
      this.retryValues = [];
    }
  }
}
