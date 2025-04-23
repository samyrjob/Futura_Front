import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { appReducer } from './app/app.reducer';
import { provideStore } from '@ngrx/store';




bootstrapApplication(AppComponent, {...appConfig, providers: [
  ...appConfig.providers!,
  provideStore(appReducer), // <-- This is where you add it
],})
  .catch((err) => console.error(err));







  