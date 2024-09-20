import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rejected-page',
  templateUrl: './rejected-page.component.html',
  styleUrls: ['./rejected-page.component.css']
})
export class RejectedPageComponent {
  constructor(private router: Router) { }

  navigateToRejectedList(): void {
    this.router.navigate(['/rejected-list']);
  }
}
