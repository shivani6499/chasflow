import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { baseUrl } from '../utils/api';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements AfterViewInit {
  forecastPeriod: string = '';
  selectedOption: number = 0;
  searchValue: string = '';
  accounts: any[] = [];
  yearlySummary: any = {};
  loading: boolean = false;
  error: string | null = null;
  startDate: string = '';
  endDate: string = '';
  dateRangeToggled: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router
  ) {}

  onOptionChange() {
    console.log('Selected option:', this.selectedOption);
  }

  search() {
    this.loading = true;
    this.error = null;
    const url = this.buildUrl();

    if (!url) {
      this.loading = false;
      return;
    }

    console.log('Constructed URL:', url);

    this.http.get(url).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.code === 200 && response.status === 'success') {
          this.accounts = response.data;

          this.accounts.forEach((account) => (account.showTable = false));

          if (this.accounts.length > 0) {
            const accountNumber = this.accounts[0].accountNumber;
            this.fetchYearlySummary(
              accountNumber,
              this.startDate,
              this.endDate
            );
          }
        } else {
          this.error = response.message || 'No data found.';
        }
      },
      (error) => {
        this.loading = false;
        this.error = 'Error fetching data. Please try again later.';
        console.error('HTTP request error:', error);
      }
    );
  }

  onDateChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedDate = new Date(inputElement.value);

    if (!isNaN(selectedDate.getTime())) {
      const endDate = new Date(selectedDate);
      endDate.setMonth(endDate.getMonth() + 6);

      // Format the dates
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const startDateFormatted = selectedDate.toLocaleDateString(
        undefined,
        options
      );
      const endDateFormatted = endDate.toLocaleDateString(undefined, options);

      this.startDate = selectedDate.toISOString().split('T')[0];
      this.endDate = endDate.toISOString().split('T')[0];

      this.forecastPeriod = `${startDateFormatted} - ${endDateFormatted}`;
      console.log('Forecast period:', this.forecastPeriod);
      console.log('Start date:', this.startDate, 'End date:', this.endDate);
      if (this.accounts.length > 0) {
        const accountNumber = this.accounts[0].accountNumber;
        this.fetchYearlySummary(accountNumber, this.startDate, this.endDate);
      }
    } else {
      this.forecastPeriod = 'Please select a valid date.';
    }
  }

  toggleTable(account: any) {
    this.dateRangeToggled = !this.dateRangeToggled;

    if (this.dateRangeToggled) {
      console.log('Date range toggled on.');
      if (this.startDate && this.endDate) {
        console.log('Fetching data for the selected date range.');
        this.fetchYearlySummary(
          account.accountNumber,
          this.startDate,
          this.endDate
        );
      } else {
        console.log('Please select both start and end dates.');
        this.error =
          'Start and end dates are required when date range is toggled.';
      }
    } else {
      console.log('Date range toggled off. No date filter applied.');
      this.fetchYearlySummary(account.accountNumber, '', '');
    }

    this.router.navigate(['/summary-view'], {
      queryParams: {
        accountNumber: account.accountNumber,
        startDate: this.startDate,
        endDate: this.endDate,
      },
    });
  }

  private fetchYearlySummary(
    accountNumber: string,
    startDate: string,
    endDate: string
  ) {
    const yearlySummaryUrl = `${baseUrl}transactions/custom-range-summary?accountNumber=${accountNumber}&startDate=${startDate}&endDate=${endDate}`;
    console.log('Yearly summary URL:', yearlySummaryUrl);

    this.http.get(yearlySummaryUrl).subscribe(
      (response: any) => {
        console.log('Yearly Summary Response:', response);

        if (response.code === 200 && response.status === 'success') {
          this.yearlySummary[accountNumber] = response.data;
          console.log('Yearly Summary:', this.yearlySummary);
          const account = this.accounts.find(
            (acc) => acc.accountNumber === accountNumber
          );

          if (account) {
            account.yearlyOpeningBalance = response.data.openingBalance;
            account.yearlyClosingBalance = response.data.closingBalance;
            console.log('Opening Balance:', account.yearlyOpeningBalance);
            console.log('Closing Balance:', account.yearlyClosingBalance);
          }
        } else {
          this.error = response.message || 'No yearly summary data found.';
        }
      },
      (error) => {
        this.error = 'Error fetching yearly summary. Please try again later.';
        console.error('HTTP request error (Yearly Summary):', error);
      }
    );
  }

  private buildUrl(): string {
    let url = `${baseUrl}accounts/search?`;
    console.log('searchValue', this.searchValue);
    this.selectedOption = Number(this.selectedOption);

    switch (this.selectedOption) {
      case 1:
        url += `accountNumber=${encodeURIComponent(this.searchValue)}`;
        break;

      case 2:
        url += `accountTitle=${encodeURIComponent(this.searchValue)}`;
        break;

      default:
        this.error = 'Please select a search option.';
        return '';
    }

    return url;
  }

  ngAfterViewInit(): void {
    const canvas1 = document.getElementById('donutChart1') as HTMLCanvasElement;
    const ctx1 = canvas1?.getContext('2d');
    
    if (ctx1) {
      new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: [
            'Cheque Collection        300 AED', 
            'Cash Collection            50  AED', 
            'POC Collection          100 AED', 
            'E mandate             200 AED', 
            'Invoice Financing    150 AED'
          ], 
          datasets: [
            {
              label: 'My Dataset',
              data: [300, 50, 100, 200, 150],
              backgroundColor: ['#E06C83', '#30417E', '#D59524', '#52BEA7', '#B9DF4B'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '80%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 10,
                padding: 8,
                font: {
                  size: 8,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const datasetLabel = tooltipItem.dataset.label || '';
                  const dataLabel = tooltipItem.label || '';
                  const amount = tooltipItem.raw;
    
                  // Increase space before the amount
                  return [
                    `${datasetLabel}: ${dataLabel}`,
                    `    <b>${amount} AED</b>`, // Additional spaces added here
                  ];
                },
              },
              titleFont: {
                size: 10,
              },
              bodyFont: {
                size: 10,
              },
            },
          },
        },
      });
    }
    
    
    
    
    const canvas2 = document.getElementById('donutChart2') as HTMLCanvasElement;
    const ctx2 = canvas2?.getContext('2d');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: [
            'Future Payment 300 AED', 
            'Payment by SI 50 AED', 
            'Bill Payment Schedule 100 AED', 
            'Tax Payment Schedule 200 AED', 
            'Loan EMIs 150 AED'
          ], 
          datasets: [
            {
              label: 'My Dataset',
              data: [300, 50, 100, 200, 150],
              backgroundColor: ['#E06C83', '#30417E', '#D59524', '#52BEA7', '#B9DF4B'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '80%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 10,
                padding: 8,
                font: {
                  size: 10, // Increased font size for better visibility
                  weight: 'bold', // Make label text bold
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const datasetLabel = tooltipItem.dataset.label || '';
                  const dataLabel = tooltipItem.label || '';
                  const amount = tooltipItem.raw;
    
                  // Return formatted tooltip with bold amount
                  return [
                    `${datasetLabel}: ${dataLabel}`,
                    `<b style="color: #000;">${amount} AED</b>`, // Bold amount in tooltip
                  ];
                },
              },
              titleFont: {
                size: 10,
              },
              bodyFont: {
                size: 10,
                weight: 'bold', // Make tooltip body bold
              },
            },
          },
        },
      });
    }
  }
}
