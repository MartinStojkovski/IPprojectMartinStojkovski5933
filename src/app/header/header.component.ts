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
        <a routerLink="/subscription" class="sub">Subscription</a>
      </div>
    </header>
  `,
  styles: [`
    header {
    background: rgb(75, 128, 0);
    padding:0;
    height:100px;
}

a{
    
    color:white;

}

a:hover{
    background-color:rgb(134, 220, 4);
    color:white;
}

.container{
    margin:0 auto;
    display: flex;
    justify-content: space-between;
}

.logo{
    font-weight:bold;
    padding:1em;
    font-size:30.6px;
}

.sub{
    padding:1em;
    font-size:30.6px;   
}
  `]
})
export class HeaderComponent {}
