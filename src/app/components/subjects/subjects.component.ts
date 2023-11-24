import { Component } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-subjects',
  template: `
    <h1>Subjects</h1>
    <button
      (click)="subjectSubscribe()"
      [ngStyle]="{ border: subjectShow ? '1px solid red' : '' }"
    >
      Subject
    </button>
    <button
      (click)="behaviorSubjectSubscribe1()"
      [ngStyle]="{ border: behaviorSubjectShow ? '1px solid red' : '' }"
    >
      Behavior Subject
    </button>

    <div>
      <!-- Subject -->
      <ng-container *ngIf="subjectShow">
        <h3>Subject</h3>
        <p>
          Subscription 1 value:
          {{ subjectValue1 !== null ? subjectValue1 : 'No Value Yet' }}
        </p>
        <p>
          Subscription 2 value:
          {{ subjectValue2 !== null ? subjectValue2 : 'No Value Yet' }}
        </p>
        <button (click)="subjectIncrement()">Increment</button>
      </ng-container>

      <!-- Behavior Subject -->
      <ng-container *ngIf="behaviorSubjectShow">
        <h3>Behavior Subject</h3>
        <p>
          Subscription 1 value:
          {{
            behaviorSubjectValue1 !== null
              ? behaviorSubjectValue1
              : 'No Value Yet'
          }}
        </p>
        <p>
          Subscription 2 value:
          {{
            behaviorSubjectValue2 !== null
              ? behaviorSubjectValue2
              : 'No Value Yet'
          }}
        </p>
        <button (click)="behaviorSubjectIncrement()">Increment</button>
        <button (click)="behaviorSubjectSubscribe2()">Subscribe 2</button>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class SubjectsComponent {
  // subject
  subjectShow: boolean = false;
  subjectCounter: number = 0;
  subjectSubscription1: Subscription | null = null;
  subjectSubscription2: Subscription | null = null;
  subjectValue1: number | null = null;
  subjectValue2: number | null = null;
  subject$ = new Subject<number>(); // Subjects are multicasted, meaning that when there are multiple subscribers, they are subscribing to the same subject and receiving the same values.

  subjectSubscribe() {
    if (!this.subjectShow) {
      this.subjectShow = true;
      this.subjectSubscription1 = this.subject$.subscribe({
        next: (value) => {
          this.subjectValue1 = value; // When we first subscribe to a subject, we don't receive any value until we manually emit new values
        },
      }); // This is our first subscription of the same subject
      this.subjectSubscription2 = this.subject$.subscribe({
        next: (value) => {
          this.subjectValue2 = value;
        },
      }); // This is our second subscription of the same subject
    } else {
      this.subjectShow = false;
      this.subjectCounter = 0;
      this.subjectSubscription1!.unsubscribe();
      this.subjectSubscription2!.unsubscribe();
      this.subjectValue1 = null;
      this.subjectValue2 = null;
    }
  }

  subjectIncrement() {
    this.subjectCounter++;
    this.subject$.next(this.subjectCounter); // We use the .next() method on subjects to manually emit a new value to it's subscribers.
  }

  // ==================
  // BehaviorSubject
  behaviorSubjectShow: boolean = false;
  behaviorSubjectCounter: number = 0;
  behaviorSubjectSubscription1: Subscription | null = null;
  behaviorSubjectSubscription2: Subscription | null = null;
  behaviorSubjectValue1: number | null = null;
  behaviorSubjectValue2: number | null = null;
  behaviorSubject$ = new BehaviorSubject<number>(this.behaviorSubjectCounter); // When creating a behavior subject, we must pass in an initial value. BehaviorSubjects are just subjects that holds the previously emitted value (or the initial value).
  // -> subscriber1 subscribes to behaviorSubject$
  // -> subscriber1 receives the initial value immediately after subscribing
  // -> behaviorSubject$ emits a new value 1, this value becomes the last emitted value
  // -> subscriber2 subscribes to behaviorSubject$
  // -> both subscriber1 and subscriber2 receives the new value 1

  behaviorSubjectSubscribe1() {
    if (!this.behaviorSubjectShow) {
      this.behaviorSubjectShow = true;
      this.behaviorSubjectSubscription1 = this.behaviorSubject$.subscribe({
        next: (value) => {
          this.behaviorSubjectValue1 = value; // When we first subscribe to a behavior subject, we receive the initial value immediately
        },
      });
    } else {
      this.behaviorSubjectShow = false;
      this.behaviorSubjectCounter = 0;
      this.behaviorSubjectSubscription1!.unsubscribe();
      this.behaviorSubjectSubscription2?.unsubscribe();
      this.behaviorSubjectValue1 = null;
      this.behaviorSubjectValue2 = null;
    }
  }

  behaviorSubjectSubscribe2() {
    this.behaviorSubjectSubscription2 = this.behaviorSubject$.subscribe({
      next: (value) => {
        this.behaviorSubjectValue2 = value; // When subscriber2 subscribes to behaviorSubject$, it receives the last emitted value immediately
      },
    });
  }

  behaviorSubjectIncrement() {
    this.behaviorSubjectCounter++;
    this.behaviorSubject$.next(this.behaviorSubjectCounter);
  }
}
