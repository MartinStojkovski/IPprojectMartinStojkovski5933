import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HeaderComponent } from './app/header/header.component';
import { InputFormComponent } from './app/input-form/input-form.component';
import { SubscriptionComponent } from './app/subscription/subscription.component';
import { ArchiveComponent } from './app/archive/archive.component';


const routes: Route[] = [
  { path: '', redirectTo: '/input-form', pathMatch: 'full' },
  { path: 'archive', component:ArchiveComponent},
  { path: 'input-form', component: InputFormComponent },
  { path: 'subscription', component: SubscriptionComponent },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
});
