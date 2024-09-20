import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../utils/api';
import { AlertService } from '../utils/aleartService';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.css'],
})
export class SummaryViewComponent implements OnInit {
  accountNumber!: string;
  startDate!: string;
  endDate!: string;
  accountSummary: any = {};
  transactionList: any[] = [];
  removedTransactions: any[] = [];
  selectedTransactionId: number | null = null;
  showingTransactions: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient,private alertService: AlertService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.accountNumber = params['accountNumber'];
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];

      if (this.accountNumber && this.startDate && this.endDate) {
        this.fetchData();
      } else {
        console.error('Missing parameters.');
      }
    });
  }
  closePopup(): void {
    this.selectedTransactionId = null;
  }

  fetchData(): void {
    if (!this.accountNumber || !this.startDate || !this.endDate) {
      console.error('Account number, start date, or end date not provided');
      return;
    }

    const apiUrl = `${baseUrl}transactions/custom-range-summary?accountNumber=${this.accountNumber}&startDate=${this.startDate}&endDate=${this.endDate}`;

    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.accountSummary = {
            cifId: response.data.cifId,
            corporateName: response.data.corporateName,
            accountNumber: response.data.accountNumber,
            openingBalance: response.data.openingBalance,
            closingBalance: response.data.closingBalance,
            odLimit: response.data.odLimit,
            startDate: response.data.startDate,
            endDate: response.data.endDate,
            totalCashInflow: response.data.totalCashInflow,
            totalCashOutflow: response.data.totalCashOutflow,
            netCashflow: response.data.netCashflow,
          };

          this.transactionList = response.data.transactions.content || [];
          this.removedTransactions =
            response.data.ignoredTransactions.content || [];
        } else {
          console.error('Error fetching data:', response.message);
        }
      },
      error: (error: any) => {
        console.error('There was an error!', error);
      },
    });
  }
  closeMenu() {
    this.selectedTransactionId = null;
  }

  toggleMenu(transactionId: number): void {
    this.selectedTransactionId =
      this.selectedTransactionId === transactionId ? null : transactionId;
  }

  editTransaction(transaction: any): void {
    console.log('Edit', transaction);
  }

  modifyTransaction(transaction: any): void {
    console.log('Modify', transaction);
  }

  deleteTransaction(transactionId: number) {
    this.http.delete( baseUrl + 'transactions/' + transactionId).subscribe(
      (response) => {
        this.alertService.showAlert('success', 'Your Data is Delete');
        this.fetchData();
      },
      (error) => {
        this.alertService.showAlert('error', 'Failed to delete');
      }
    );
  }
  ignoreTransaction(transaction: any): void {
    this.transactionList = this.transactionList.filter(
      (t) => t.id !== transaction.id
    );
    this.removedTransactions.push(transaction);
    this.showingTransactions = false;
  }

  restoreTransaction(transaction: any): void {
    this.removedTransactions = this.removedTransactions.filter(
      (t) => t.id !== transaction.id
    );
    this.transactionList.push(transaction);
    this.showingTransactions = true;
  }

  showTransactions(): void {
    this.showingTransactions = true;
  }

  showRemovedTransactions(): void {
    this.showingTransactions = false;
  }
}
