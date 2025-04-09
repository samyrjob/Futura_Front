import { Injectable } from "@angular/core";
import { fromEvent, interval } from "rxjs";

// user-activity.service.ts
@Injectable({ providedIn: 'root' })
export class UserActivityService {
  private lastActivityTime = Date.now();
  private activityCheckInterval = 30000; // 30 seconds

  constructor() {
    // Track common user events
    fromEvent(document, 'mousemove').subscribe(() => this.updateActivity());
    fromEvent(document, 'keydown').subscribe(() => this.updateActivity());
    fromEvent(document, 'click').subscribe(() => this.updateActivity());

    // Periodic check
    interval(this.activityCheckInterval).subscribe(() => {
      if (!this.isUserActive()) {
        console.log('User inactive - stopping refresh');
      }
    });
  }

  updateActivity() {
    this.lastActivityTime = Date.now();
  }

  isUserActive(): boolean {
    const inactiveDuration = Date.now() - this.lastActivityTime;
    return inactiveDuration < (this.activityCheckInterval * 2); // 60s threshold
  }
}
