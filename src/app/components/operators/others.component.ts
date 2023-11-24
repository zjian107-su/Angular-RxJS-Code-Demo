import { Component } from '@angular/core';
import { tap, every, find, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-others',
  template: `
    <h2>
      {{
        tapShow || everyShow || findShow
          ? tapShow
            ? 'Utility Operators'
            : 'Conditional Operators'
          : 'Other Operators'
      }}
    </h2>
    <button
      (click)="tapSubscribe()"
      [ngStyle]="{ border: tapShow ? '1px solid red' : '' }"
    >
      Tap
    </button>
    <button
      (click)="everySubscribe()"
      [ngStyle]="{ border: everyShow ? '1px solid red' : '' }"
    >
      Every
    </button>
    <button
      (click)="findSubscribe()"
      [ngStyle]="{ border: findShow ? '1px solid red' : '' }"
    >
      Find
    </button>

    <div>
      <ng-container *ngIf="tapShow">
        <p>Check the console for the values</p>
      </ng-container>

      <ng-container *ngIf="everyShow">
        <p>Every value is greater than 2: {{ everyValue }}</p>
      </ng-container>

      <ng-container *ngIf="findShow">
        <p>First value greater than 2: {{ findValue }}</p>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class OthersComponent {
  observable = of(1, 2, 3, 4, 5);

  // tap
  tapShow: boolean = false;
  tapSubscription: Subscription | null = null;
  tapObservable = this.observable.pipe(
    tap((x) => {
      console.log('tap', x);
    }),
  ); // tap is a utility operator, it never modifies the value of the observable, and is used for performing side-effects. We typically use it to log the value

  tapSubscribe() {
    if (!this.tapShow) {
      this.tapShow = true;
      this.tapSubscription = this.tapObservable.subscribe();
    } else {
      this.tapShow = false;
      this.tapSubscription!.unsubscribe();
    }
  }

  // ==================
  // every
  everyShow: boolean = false;
  everyValue: boolean | null = null;
  everySubscription: Subscription | null = null;
  everyObservable = this.observable.pipe(
    every((x) => {
      return x > 2;
    }),
  ); // every is a conditional operator, it emits a boolean value based on the condition we passed in

  everySubscribe() {
    if (!this.everyShow) {
      this.everyShow = true;
      this.everySubscription = this.everyObservable.subscribe({
        next: (value) => {
          this.everyValue = value;
        },
      });
    } else {
      this.everyShow = false;
      this.everyValue = null;
      this.everySubscription!.unsubscribe();
    }
  }

  // ==================
  // find
  findShow: boolean = false;
  findValue: number | undefined = undefined;
  findSubscription: Subscription | null = null;
  findObservable = this.observable.pipe(
    find((x) => {
      return x > 2;
    }),
  ); // find is a conditional operator, it emits the first value that satisfies the condition we passed in

  findSubscribe() {
    if (!this.findShow) {
      this.findShow = true;
      this.findSubscription = this.findObservable.subscribe({
        next: (value) => {
          this.findValue = value;
        },
      });
    } else {
      this.findShow = false;
      this.findValue = undefined;
      this.findSubscription!.unsubscribe();
    }
  }
}
