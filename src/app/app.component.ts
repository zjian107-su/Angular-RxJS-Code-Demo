import { Component } from '@angular/core';

@Component({
  selector: "app-root",
  template: `
    <!-- <app-subjects></app-subjects>
    <app-operators></app-operators>
    <app-transformation></app-transformation> -->

    <br>
    <nav>
      <a routerLink="/observables">Observables</a>
      <a routerLink="/subjects">Subjects</a>
      <a routerLink="/operators">Operators</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      nav {
        background-color: #ccc;
        padding: 1em;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        border-radius: 0.5em;
        gap: 1em;
      }

      a {
        text-decoration: none;
        color: #000;
        padding: 0.5em;
        border-radius: 0.5em;
        background-color: #fff;

        &:hover {
          transform: scale(1.05);
          text-decoration: none;
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          text-decoration: none;
        }
      }
    `,
  ],
})
export class AppComponent {}
