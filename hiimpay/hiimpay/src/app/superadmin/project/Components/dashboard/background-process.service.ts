import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackgroundProcessService {

  constructor() { }

  private backgroundProcessSubject = new BehaviorSubject<boolean>(false);
  backgroundProcess$ = this.backgroundProcessSubject.asObservable();

  private backgroundProcessSubjectForReminder = new BehaviorSubject<boolean>(false);
  backgroundProcessReminder$ = this.backgroundProcessSubjectForReminder.asObservable();

  showBackgroundMessage() {
    this.backgroundProcessSubject.next(true);
  }

  hideBackgroundMessage() {
    this.backgroundProcessSubject.next(false);
  }

  showBackgroundMessageForReminder() {
    this.backgroundProcessSubjectForReminder.next(true);
  }

  hideBackgroundMessageForReminder() {
    this.backgroundProcessSubjectForReminder.next(false);
  }

}
