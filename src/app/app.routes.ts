import { Routes } from '@angular/router';
import { InputFormComponent } from './input-form/input-form.component';
import { SubscriptionComponent } from './subscription/subscription.component';


export const routes: Routes = [
    {path:'',component:InputFormComponent},
    {path:'subscription',component:SubscriptionComponent},

    {path:'**',redirectTo:''}
];
