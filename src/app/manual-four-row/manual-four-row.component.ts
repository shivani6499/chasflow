import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AlertService } from '../utils/aleartService';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { baseUrl } from '../utils/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-manual-four-row',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './manual-four-row.component.html',
  styleUrls: ['./manual-four-row.component.css'],
})
export class ManualFourRowComponent implements OnInit, AfterViewInit {
  forecastForm!: FormGroup;

  private apiUrl = baseUrl + 'forecasts';

  corporateCode: string = '';
  corporateName: string = '';
  forecastingAs: string = '';
  entryType: string = '';
  narration: string = '';
  description: string = '';
  mode: string = '';
  beneficiaryPayers: string = '';
  // accountType: string = '';
  accountNumber: string = '';
  forecastedAmount: number = 0;
  currency: string = 'INR';
  lockRecord: boolean = true;
  valueDate: string = '';
  recurringFrom: string = '';
  recurringTo: string = '';
  // today: any;
  recurrencePattern: string = '';
  searchbyTxt: any;
  accountTypes: any[] = [];
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  searchBy: string = 'corporateCode';
  apiAllUrl = baseUrl + 'corporate/all';
  corporateTypeTxt: string = '';
  
  today: string = new Date().toISOString().split('T')[0];
  
  
  updateRecurringOptions() {
    const fromDateValue = this.formData.recurringFrom;
    const toDateValue = this.formData.recurringTo;
  
    if (fromDateValue && toDateValue) {
      const fromDate = new Date(fromDateValue);
      const toDate = new Date(toDateValue);
      const timeDiff = toDate.getTime() - fromDate.getTime();
      const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
      const maxDays = 180;
  
      if (dayDiff > maxDays) {
        alert('The selected date range exceeds 6 months. Please choose a valid range.');
        this.formData.recurringTo = '';
        this.recurringOptions = [];
        return;
      }
  
      this.recurringOptions = [];
  
      if (dayDiff >= 7) {
        this.recurringOptions.push('Daily', 'Weekly');
      } else if (dayDiff > 0) {
        this.recurringOptions.push('Daily');
      }
  
      if (dayDiff >= 30) {
        this.recurringOptions.push('Monthly');
      }
  
      // To avoid duplicate options
      this.recurringOptions = [...new Set(this.recurringOptions)];
    } else {
      this.recurringOptions = [];
    }
  }
  
 onKeyupSearch(event: KeyboardEvent) {
    if (!this.searchbyTxt || this.searchbyTxt.trim() === '') {
      this.refreshData();
    }
  }

  accountOptions = {
    internalAccount: [
      { value: 'internalAcc001', text: 'Internal Acc 001' },
      { value: 'internalAcc002', text: 'Internal Acc 002' },
    ],
    externalAccount: [
      { value: 'externalAcc001', text: 'External Acc 001' },
      { value: 'externalAcc002', text: 'External Acc 002' },
    ],
  };

  modeOptions = {
    inwardPayment: [
      { value: 'accountDeposit', text: 'Account Deposit' },
      { value: 'cash', text: 'Cash' },
    ],
    outwardPayment: [
      { value: 'accountWithdrawal', text: 'Account Withdrawal' },
      { value: 'cash', text: 'Cash' },
    ],
  };

  modeOptionsList: { value: string; text: string }[] = [];
  onForecastingAsChange(event: any): void {
    const selectedForecastingAs = event.target.value;
    if (selectedForecastingAs === 'Inward Payment') {
      this.modeOptionsList = this.modeOptions.inwardPayment;
    } else if (selectedForecastingAs === 'Outward Payment') {
      this.modeOptionsList = this.modeOptions.outwardPayment;
    } else {
      this.modeOptionsList = [];
    }
  }

  @ViewChild('entryType', { static: false })
  entryTypeSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('accountType', { static: false })
  accountTypeSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('accountNumber', { static: false })
  accountNumberSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('forecastingAs', { static: false })
  forecastingAsSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('mode', { static: false })
  modeSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('searchBy', { static: false })
  searchBySelect!: ElementRef<HTMLSelectElement>;

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private alertService: AlertService,
    private ngxLoader: NgxUiLoaderService,
    
  ) {}

  formData = {
    corporateCode: '',
    corporateName: '',
    forecastingAs: '',
    forecastCurrency: 'INR',
    entryType: '',
    narration: '',
    description: '',
    mode: '',
    beneficiaryPayers: '',
    accountType: '',
    accountNumber: '',
    forecastedAmount: '',
    lockRecord: false,
    valueDate: '',
    recurringFrom: '',
    recurringTo: '',
    recurrencePattern: '',
  };
  isOneTime = false;
  isRecurring = false;
  recurringOptions = ['Daily', 'Weekly', 'Monthly']; 
 
  toggleFields() {
    this.isOneTime = this.formData.entryType === 'O';
    this.isRecurring = this.formData.entryType === 'R';
  }
  ngOnInit(): void {
    this.ngxLoader.start();
    this.corporateCodeAllDetail();
    this.corporateTypeTxt = '';
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
  }
  ngAfterViewInit(): void {
    this.ngxLoader.stop();
    this.toggleValueDate();
  }

  filterDataObj = {
    page: 1,
    size: 4,
  };
  
  hasNextPage = true; 
  hasPreviousPage = false; 
  
  onPrevious() {
    if (this.filterDataObj.page > 1) {
      this.filterDataObj.page--;
      this.corporateCodeAllDetail();
    }
  }
  
  onNext() {
    if (this.hasNextPage) { 
      this.filterDataObj.page++;
      this.corporateCodeAllDetail();
    }
  }
  
  corporateCodeAllDetail(): void {
    const params = new HttpParams()
      .set('page', this.filterDataObj.page.toString())
      .set('size', this.filterDataObj.size.toString());
  
    this.http.get(this.apiAllUrl, { params }).subscribe(
      (result: any) => {
        if (result && result.data && result.data.content) {
          this.users = result.data.content;
          this.filteredUsers = [...this.users];
          
          // Determine if there is data for the next page
          this.hasNextPage = result.data.content.length === this.filterDataObj.size;
  
         
          this.hasPreviousPage = this.filterDataObj.page > 1;
  
       
          if (!this.hasNextPage && this.filterDataObj.page > 3) {
            this.filterDataObj.page--;
          }
        } else {
          console.error('Unexpected response structure', result);
        }
      },
      (error) => console.error('Subscription error', error)
    );
  }
  
  openPopup() {
    this.corporateCodeAllDetail();
  }

  searchByCorporate(corporateCode: string): void {
    let url = baseUrl + 'corporate/corporate-code/' + this.searchbyTxt;
    if (corporateCode === 'corporateName') {
      url = baseUrl + 'corporate/corporate-name/' + this.searchbyTxt;
    }
    this.http.get(url).subscribe(
      (result: any) => {
        this.filteredUsers = result.data.content;
      },
      (error) => console.error('Subscription error', error)
    );
  }

  onSearchClick(): void {
    let url = baseUrl + 'corporate/corporate-code/' + this.searchbyTxt;

    if (this.corporateTypeTxt === 'corporateName') {
      url = baseUrl + 'corporate/corporate-name/' + this.searchbyTxt;
    }

    this.http.get(url).subscribe(
      (result: any) => {

        if (result && result.data && result.data.content) {
          this.filteredUsers = result.data.content;
        } else {

          this.showError(
            'No results found for the provided corporate code or name.'
          );
        }
      },
      (error) => {

        if (error.status === 404) {
          this.showError(
            'Corporate code or name not found. Please enter a valid one.'
          );
        } else {
          this.showError(
            'An error occurred during the search. Please try again.'
          );
        }
        console.error('Search error:', error);
      }
    );
  }

  showError(message: string): void {
    alert(message);
  }

  toggleValueDate(): void {
    const entryType = (
      document.getElementById('entryType') as HTMLSelectElement
    ).value;
    const valueDateField = document.getElementById(
      'valueDateField'
    ) as HTMLElement;
    const recurringFieldsFrom = document.getElementById(
      'recurringFieldsFrom'
    ) as HTMLElement;
    const recurringFieldsTo = document.getElementById(
      'recurringFieldsTo'
    ) as HTMLElement;
    const recurringFieldsPattern = document.getElementById(
      'recurringFieldsPattern'
    ) as HTMLElement;

    if (entryType === 'O') {
      valueDateField.style.display = 'block';
      recurringFieldsFrom.style.display = 'none';
      recurringFieldsTo.style.display = 'none';
      recurringFieldsPattern.style.display = 'none';
    } else if (entryType === 'R') {
      valueDateField.style.display = 'none';
      recurringFieldsFrom.style.display = 'block';
      recurringFieldsTo.style.display = 'block';
      recurringFieldsPattern.style.display = 'block';
    } else {
      valueDateField.style.display = 'none';
      recurringFieldsFrom.style.display = 'none';
      recurringFieldsTo.style.display = 'none';
      recurringFieldsPattern.style.display = 'none';
    }
  }

  refreshData(): void {
    this.corporateCodeAllDetail();
  }

  onAccountTypeChange() {
    if (this.formData.corporateCode && this.formData.accountType) {
      const url =
        baseUrl +
        `accounts/by-type?accountType=${this.formData.accountType}&corporateId=${this.corporateCodeId}`;
      this.http.get(url).subscribe((response: any) => {
        this.accountTypes = response.data;
      });
    } else {
      this.alertService.showAlert(
        'Error',
        'Please add corporate code and select an account type first'
      );
    }
  }

  corporateCodeId: any;
  selectRow(user: any): void {
    this.corporateCodeId = user.id;
    this.formData.corporateCode = user.corporateCode;
    this.formData.corporateName = user.corporateName;
  }

submitForm(): void {
    const missingFields = this.checkForMissingFields();
    if (missingFields.length > 0) {
      this.alertService.showAlert(
        'Missing Field',
        `The following fields are missing: ${missingFields.join(', ')}`
      );
    } else {
      this.http
        .post(baseUrl + 'forecasts', this.formData)
        .pipe(
          catchError((error) => {
            this.alertService.showAlert(
              'Error',
              'Error occurred while saving the forecast.'
            );
            return throwError(error);
          })
        )
        .subscribe((response: any) => {
          const referenceNumber = response?.data?.referenceNumber;
          this.alertService.showAlert(
            'Success',
            `Data added successfully, Reference id is ${referenceNumber}`
          );
          this.formData = {
            corporateCode: '',
            corporateName: '',
            forecastingAs: '',
            forecastCurrency: 'INR',
            entryType: '',
            narration: '',
            description: '',
            mode: '',
            beneficiaryPayers: '',
            accountType: '',
            accountNumber: '',
            forecastedAmount: '',
            lockRecord: false,
            valueDate: '',
            recurringFrom: '',
            recurringTo: '',
            recurrencePattern: '',
          };
        });
    }
  }

  cancel() {
    this.formData = {
      corporateCode: '',
      corporateName: '',
      forecastingAs: '',
      forecastCurrency: 'INR',
      entryType: '',
      narration: '',
      description: '',
      mode: '',
      beneficiaryPayers: '',
      accountType: '',
      accountNumber: '',
      forecastedAmount: '',
      lockRecord: false,
      valueDate: '',
      recurringFrom: '',
      recurringTo: '',
      recurrencePattern: '',
    };
  }
  checkForMissingFields(): string[] {
    const missingFields = [];
    if (this.formData.entryType === 'O' && !this.formData.valueDate) {
      missingFields.push('valueDate');
    }

    if (this.formData.entryType === 'R') {
      if (!this.formData.recurringFrom) {
        missingFields.push('recurringFrom');
      }
      if (!this.formData.recurringTo) {
        missingFields.push('recurringTo');
      }
      if (!this.formData.recurrencePattern) {
        missingFields.push('recurringPattern');
      }
    }

    return missingFields;
  }

  loadAccountNumbers(selectedType: string): void {
    const corporateId = 3; 
    let encodedType = encodeURIComponent(selectedType.trim()); 

    if (encodedType === 'internal Account') {
      encodedType = 'Internal Account';
    } else if (encodedType === 'externalAccount') {
      encodedType = 'External Account';
    }

    const url = `${baseUrl}accounts/by-type?accountType=${encodeURIComponent(
      encodedType
    )}&corporateId=${corporateId}`; 
    this.http.get<any>(url).subscribe(
      (result) => { 
        if (result && result.data) {
          this.accountTypes = result.data.map((item: any) => ({
            value: item.accountNumber, 
            text: item.accountNumber, 
          }));
        } else {
          this.accountTypes = [];
          console.error('Unexpected response structure:', result); 
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching account numbers:', error); 
        this.alertService.showAlert('Error', 'Error fetching account numbers.');
      }
    );
  }
}
