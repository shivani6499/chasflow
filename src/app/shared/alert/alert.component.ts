import { Component, OnInit } from '@angular/core';
import { AlertServiceNew } from '../alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  message: string = '';
  type: 'success' | 'error' | 'warning' | 'info' = 'info';
  show: boolean = false;

  constructor(private alertService: AlertServiceNew) {this.show = true;}

  ngOnInit() {
    this.alertService.alertState$.subscribe((alert) => {
      console.log('Received alert:', alert);
      this.message = alert.message;
      this.type = alert.type;
      this.show = true; // Show the alert
    

      // Automatically hide the alert after the specified duration
      setTimeout(() => {
        this.show = false; // Hide the alert after the duration
      }, alert.duration);
    });
  }

  close() {
    this.show = false; // Close the alert manually
  }

  getAlertClass() {
    return {
      'alert-success': this.type === 'success',
      'alert-danger': this.type === 'error',
      'alert-warning': this.type === 'warning',
      'alert-info': this.type === 'info',
      show: this.show // Add the 'show' class when the alert is visible
    };
  }
}
