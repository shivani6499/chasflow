import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  
})
export class NavbarComponent implements OnInit {
  isCashflowMenuOpen = false;
  isTransactionMenuOpen = false;
  isManualForecastMenuOpen = false;

  constructor() { }

  ngOnInit(): void { }

  toggleCashflowMenu(): void {
    this.isCashflowMenuOpen = !this.isCashflowMenuOpen;
    this.isTransactionMenuOpen = false;
    this.isManualForecastMenuOpen = false;
  }

  toggleTransactionMenu(): void {
    this.isTransactionMenuOpen = !this.isTransactionMenuOpen;
    this.isManualForecastMenuOpen = false;
  }

  toggleManualForecastMenu(): void {
    this.isManualForecastMenuOpen = !this.isManualForecastMenuOpen;
  }
}
