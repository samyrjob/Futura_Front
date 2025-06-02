import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { logout } from '../authentication/auth.actions';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private inactivitySubscription: Subscription | null = null;
  private activityEvents$: any;
  private readonly INACTIVITY_TIME = 1 * 60 * 1000; // 1 minute
  private isBrowser: boolean;

  constructor(
    private store: Store<AppState>,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.activityEvents$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'click'),
        fromEvent(document, 'scroll'),
        fromEvent(document, 'touchstart')
      );
    }
  }

  startMonitoring() {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      this.activityEvents$.subscribe(() => {
        this.resetTimer();
      });
    });

    this.resetTimer();
  }

  stopMonitoring() {
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
  }

  private resetTimer() {
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
    this.inactivitySubscription = timer(this.INACTIVITY_TIME).subscribe(() => {
      this.ngZone.run(() => {
        this.store.dispatch(logout());
      });
    });
  }
}
