import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceNew {
  private alertSubject = new Subject<{ message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number }>();

  // Observable that can be subscribed to for alert notifications
  alertState$ = this.alertSubject.asObservable();

  // Method to trigger an alert
  showAlert( type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number = 5000) {
   console.log(message,'message');
    this.alertSubject.next({ message, type, duration });
  }
}
