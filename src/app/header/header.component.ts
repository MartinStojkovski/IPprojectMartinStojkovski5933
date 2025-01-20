import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-header',
  template: `
    <header>
      <div class="container">
        <a routerLink="/input-form" class="logo">InvoiceMaker</a>
        <div class="buttons">
          <a routerLink="/archive" class="archive">Archive</a>
          <a routerLink="/subscription" class="sub">Subscription</a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    header {
      background: rgb(75, 128, 0);
      padding: 0;
      height: 100px;
    }

    a {
      color: white;
      text-decoration: none;
    }

    a:hover {
      background-color: rgb(134, 220, 4);
      color: white;
    }

    .container {
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .logo {
      font-weight: bold;
      font-size: 30.6px;
      padding: 1em;
    }

    .logo:hover {
      background-color: rgb(134, 220, 4);
      color: white;
    }

    .buttons {
      display: flex;
      
      margin-left: auto;
    }

    .archive, .sub {
      padding: 1em;
      font-size: 30.6px;
    }
  `]
})
export class HeaderComponent {}
