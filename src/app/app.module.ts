import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ObservablesComponent } from './components/observables/observables.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { OperatorsComponent } from './components/operators/operators.component';
import { JoinCreationComponent } from './components/operators/join-creation.component';
import { TransformationComponent } from './components/operators/transformation.component';
import { FilteringComponent } from './components/operators/filtering.component';
import { ErrorHandlingComponent } from './components/operators/error-handling.component';
import { OthersComponent } from './components/operators/others.component';

@NgModule({
  declarations: [
    AppComponent,
    ObservablesComponent,
    SubjectsComponent,
    OperatorsComponent,
    JoinCreationComponent,
    TransformationComponent,
    FilteringComponent,
    ErrorHandlingComponent,
    OthersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
