import { Component } from '@angular/core';

@Component({
  selector: 'app-operators',
  template: `
    <h1>Operators</h1>
    <button
      (click)="switchCase('joinCreation')"
      [ngStyle]="{
        border: operatorType === 'joinCreation' ? '1px solid red' : ''
      }"
    >
      Join Creation
    </button>
    <button
      (click)="switchCase('transformation')"
      [ngStyle]="{
        border: operatorType === 'transformation' ? '1px solid red' : ''
      }"
    >
      Transformation
    </button>
    <button
      (click)="switchCase('filtering')"
      [ngStyle]="{
        border: operatorType === 'filtering' ? '1px solid red' : ''
      }"
    >
      Filtering
    </button>
    <button
      (click)="switchCase('errorHandling')"
      [ngStyle]="{
        border: operatorType === 'errorHandling' ? '1px solid red' : ''
      }"
    >
      Error Handling
    </button>
    <button
      (click)="switchCase('others')"
      [ngStyle]="{ border: operatorType === 'others' ? '1px solid red' : '' }"
    >
      Others
    </button>

    <ng-container [ngSwitch]="operatorType">
      <app-join-creation *ngSwitchCase="'joinCreation'"></app-join-creation>
      <app-transformation *ngSwitchCase="'transformation'"></app-transformation>
      <app-filtering *ngSwitchCase="'filtering'"></app-filtering>
      <app-error-handling *ngSwitchCase="'errorHandling'"></app-error-handling>
      <app-others *ngSwitchCase="'others'"></app-others>
    </ng-container>
  `,
  styles: [],
})
export class OperatorsComponent {
  operatorType: string = '';

  switchCase(type: string) {
    this.operatorType = type;
  }
}
