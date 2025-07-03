import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();

  private delayTimer?: Subscription;
  private isLoading = false;

  show() {
    this.isLoading = true;

    // Start a 500ms delay before showing the loader
    this.delayTimer = timer(500).subscribe(() => {
      if (this.isLoading) {
        this._loading.next(true);
      }
    });
  }

  hide() {
    this.isLoading = false;

    // Cancel the delay timer if it's still pending
    if (this.delayTimer) {
      this.delayTimer.unsubscribe();
      this.delayTimer = undefined;
    }

    // Hide the loader
    this._loading.next(false);
  }
}
