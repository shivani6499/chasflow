import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

    constructor() { }

    // Method to show alert with title and text
    showAlert(title: string, text: string): void {
      Swal.fire({
        title: title,
        text: text,
        customClass: {
          confirmButton: 'btn btn-primary waves-effect waves-light'
        },
        buttonsStyling: false
      });
    }  
}
