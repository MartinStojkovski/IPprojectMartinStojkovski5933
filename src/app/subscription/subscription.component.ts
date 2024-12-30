import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common'

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
  standalone: true,
  imports: [CommonModule,RouterModule], 
})
export class SubscriptionComponent {
  subscriptions = [
    { type: 'Monthly', fee: '$10' },
    { type: '3-Month', fee: '$25' },
    { type: 'Yearly', fee: '$90' },
  ];
}
