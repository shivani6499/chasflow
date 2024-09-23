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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { baseUrl } from '../utils/api';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edit-entry',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.css'],
})
export class EditEntryComponent implements OnInit, AfterViewInit {
  forecastForm!: FormGroup;

  private apiUrl = baseUrl + 'forecasts';
  isViewMode: boolean = false;

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
  recurrencePattern: string = '';
  searchbyTxt: any;
  data: any;

  accountTypes: any[] = [];
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  searchBy: string = 'corporateCode';
  apiAllUrl = baseUrl + 'corporate/all?page=0&size=400';
  apiSearchByCodeUrl = baseUrl + 'corporate/corporate-code';
  apiSearchByNameUrl = baseUrl + 'corporate/corporate-name';
  corporateTypeTxt = 'corporateCode';
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
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // Use '+' to convert to a number
  });
  }

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

  ngOnInit(): void { 
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      const id = idParam ? +idParam : 0;

      this.fetchData(id);
    });
    this.forecastForm = this.fb.group({
      accountType: ['', Validators.required],
      mode: ['', Validators.required],
      // Add other form controls as needed
    });
  }
  ngAfterViewInit(): void {
    this.checkElementAvailability();
    this.setupDropdownListeners();
    this.toggleValueDate();
  }
  checkElementAvailability(): void { 
  }
  corporateCodeAllDetail(): void {
    this.http
      .get(this.apiAllUrl)
      .pipe(
        catchError((error) => {
          console.log('Error fetching corporate details', error);
          return throwError(
            () => new Error('Error fetching corporate details')
          );
        })
      )
      .subscribe(
        (result: any) => {
          if (result && result.data && result.data.content) { 
            this.users = result.data.content; 
            this.filteredUsers = [...this.users];
            if (this.formData.accountType !== '') {
              this.onAccountTypeChange();
            }
          } else {
            console.log('Unexpected response structure', result);
          }
        },
        (error) => console.error('Subscription error', error)
      );
  }
  resetForm() {
    this.formData = {
      corporateCode: '',
      corporateName: '',
      forecastingAs: '',
      entryType: '',
      narration: '',
      description: '',
      mode: '',
      beneficiaryPayers: '',
      accountType: '',
      accountNumber: '',
      forecastCurrency: 'INR',
      forecastedAmount: '',
      lockRecord: false,
      valueDate: '',
      recurringFrom: '',
      recurringTo: '',
      recurrencePattern: '',
    };
  }

  searchByCorporateCode(corporateCode: string): void {
    this.http
      .get(`${this.apiSearchByCodeUrl}/${corporateCode}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching user details by code', error);
          return throwError(
            () => new Error('Error fetching user details by code')
          );
        })
      )
      .subscribe(
        (result: any) => {
          this.filteredUsers = result.data.content; 
        },
        (error) => console.error('Subscription error', error)
      );
  }

  openPopup() { 
    this.corporateCodeAllDetail();
  }
  searchByCorporateName(corporateName: string): void {
    if (corporateName) {
      const url = `${this.apiSearchByNameUrl}/${encodeURIComponent(
        corporateName
      )}`;
      this.http
        .get(url)
        .pipe(
          catchError((error) => {
            console.error('Error fetching user details by name', error);
            return throwError(
              () => new Error('Error fetching user details by name')
            );
          })
        )
        .subscribe(
          (result: any) => {
            this.filteredUsers = result.data.content;
          },
          (error) => console.error('Subscription error', error)
        );
    } else {
      this.filteredUsers = [...this.users];
      this.cdr.detectChanges();
    }
  }
  onSearchClick(): void {
    if (this.searchBy === 'corporateCode') { 
      this.searchByCorporateCode(this.searchbyTxt);
    } else if (this.searchBy === 'corporateName') { 
      this.searchByCorporateName(this.searchbyTxt);
    }
  }

  setupDropdownListeners(): void {
    if (this.forecastingAsSelect) {
      this.renderer.listen(
        this.forecastingAsSelect.nativeElement,
        'change',
        (event: Event) => {
          const selectedForecasting = (event.target as HTMLSelectElement).value;
          this.updateModeOptions(selectedForecasting);
        }
      );
    } else {
      console.error('forecastingAsSelect is not available');
    }
    if (this.accountTypeSelect) {
      this.renderer.listen(
        this.accountTypeSelect.nativeElement,
        'change',
        (event: Event) => {
          const selectedType = (event.target as HTMLSelectElement).value;
          this.updateAccountNumberOptions(selectedType);
        }
      );
    } else {
      console.error('accountTypeSelect is not available');
    }
    if (this.searchBySelect) {
      this.renderer.listen(
        this.searchBySelect.nativeElement,
        'change',
        (event: Event) => {
          this.searchBy = (event.target as HTMLSelectElement).value;
        }
      );
    } else {
      console.error('searchBySelect is not available');
    }
    if (this.modeSelect) {
      this.renderer.listen(
        this.modeSelect.nativeElement,
        'change',
        (event: Event) => {}
      );
    } else {
      console.error('modeSelect is not available');
    }

    if (this.accountTypeSelect) {
      this.renderer.listen(
        this.accountTypeSelect.nativeElement,
        'change',
        (event: Event) => {
          const selectedType = (event.target as HTMLSelectElement).value; 
          this.loadAccountNumbers(selectedType);
        }
      );
    } else {
      console.error('accountTypeSelect is not available');
    }
  }

  toggleValueDate(): void {
    const entryType = this.formData.entryType;  // Ensure it takes the updated formData
    const valueDateField = document.getElementById('valueDateField') as HTMLElement;
    const recurringFieldsFrom = document.getElementById('recurringFieldsFrom') as HTMLElement;
    const recurringFieldsTo = document.getElementById('recurringFieldsTo') as HTMLElement;
    const recurringFieldsPattern = document.getElementById('recurringFieldsPattern') as HTMLElement;
  
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
    }
  }
  

  updateAccountNumberOptions(selectedType: string): void {
    const accountNumberSelect = this.accountNumberSelect.nativeElement;
    accountNumberSelect.innerHTML =
      '<option value="" selected>Please Select</option>';
    const options =
      this.accountOptions[selectedType as keyof typeof this.accountOptions] ||
      [];
    options.forEach((option) => {
      const opt = this.renderer.createElement('option');
      opt.value = option.value;
      opt.textContent = option.text;
      this.renderer.appendChild(accountNumberSelect, opt);
    });
  }
  updateModeOptions(selectedForecasting: string): void {
    const modeSelect = this.modeSelect.nativeElement;
    modeSelect.innerHTML = '<option value="" selected>Please Select</option>';
    const options =
      this.modeOptions[selectedForecasting as keyof typeof this.modeOptions] ||
      [];
    options.forEach((option) => {
      const opt = this.renderer.createElement('option');
      opt.value = option.value;
      opt.textContent = option.text;
      this.renderer.appendChild(modeSelect, opt);
    });
  }
  refreshData(): void {
    this.corporateCodeAllDetail();
  }

  onAccountTypeChange() {
    if (this.formData.corporateCode && this.formData.accountType) { 
      this.corporateCodeId = this.filteredUsers.filter(
        (item) => item.corporateCode === this.formData.corporateCode
      )[0].id; 
      const url =
        baseUrl +
        `accounts/by-type?accountType=${this.formData.accountType}&corporateId=${this.corporateCodeId}`;
     
      this.http
        .get(url)
        .pipe(
          catchError((error) => {
            console.error('Error occurred while fetching accounts:', error);
            this.alertService.showAlert(
              'Error',
              'Error occurred while fetching accounts.'
            );
            return throwError(error);
          })
        )
        .subscribe((response: any) => {
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
  onSearchInput(): void { 
  }
  fetchData(id: number): void {
    this.http
      .get<any>(`http://167.172.220.75:8084/CashflowForecastingApplication/api/forecasts/${id}`)
      .subscribe({
        next: (response) => {
          if (response.code === 200 && response.status === 'success') {
            // Set formData values based on the response data
            this.formData = {
              corporateCode: response.data.corporateCode || '',
              corporateName: response.data.corporateName || '',
              forecastingAs: response.data.forecastingAs || '',
              forecastCurrency: response.data.currency || 'INR',
              entryType: response.data.entryType || '',  // Entry type
              narration: response.data.narration || '',
              description: response.data.description || '',
              mode: response.data.mode || '',
              beneficiaryPayers: response.data.beneficiaryPayers || '',
              accountType: response.data.accountType || '',
              accountNumber: response.data.accountNumber || '',
              forecastedAmount: response.data.forecastedAmount || '',
              lockRecord: response.data.lockRecord || false,
              valueDate: response.data.valueDate || '',
              recurringFrom: response.data.recurringFrom || '',
              recurringTo: response.data.recurringTo || '',
              recurrencePattern: response.data.recurrencePattern || '',
            };
            
            // Handle specific actions based on the data
            if (this.formData.forecastingAs === 'Inward Payment') {
              this.modeOptionsList = this.modeOptions.inwardPayment;
            } else if (this.formData.forecastingAs === 'Outward Payment') {
              this.modeOptionsList = this.modeOptions.outwardPayment;
            }
  
            // Perform additional actions (like toggles or dependent fields)
            this.corporateCodeAllDetail();
            setTimeout(() => {
              if (this.formData.accountType !== '') {
                this.onAccountTypeChange();
              }
            }, 3000);
            this.toggleValueDate();
          } else {
            console.error('Failed to fetch data', response);
          }
        },
        error: (error) => {
          console.error('HTTP Error', error);
        },
      });
  }
  
  
  updateData(id: number): void {
    const updatedData = {
      corporateCode: this.formData.corporateCode,
      corporateName: this.formData.corporateName,
      forecastingAs: this.formData.forecastingAs,
      currency: this.formData.forecastCurrency,
      entryType: this.formData.entryType,
      narration: this.formData.narration,
      description: this.formData.description,
      mode: this.formData.mode,
      beneficiaryPayers: this.formData.beneficiaryPayers,
      accountType: this.formData.accountType,
      accountNumber: this.formData.accountNumber,
      forecastedAmount: this.formData.forecastedAmount,
      lockRecord: this.formData.lockRecord,
      valueDate: this.formData.valueDate,
      recurringFrom: this.formData.recurringFrom,
      recurringTo: this.formData.recurringTo,
      recurrencePattern: this.formData.recurrencePattern,
    };
  console.log('shivani')
    this.http
      .put<any>(
        `http://167.172.220.75:8084/CashflowForecastingApplication/api/forecasts/${id}`,
        updatedData
      )
      .subscribe({
        next: (response) => {
          if (response.code === 200 && response.status === 'success') {
            console.log('Update successful:', response);
      
            Object.assign(this.formData, updatedData);
           
          } else {
            console.error('Failed to update data', response);
          }
        },
        error: (error) => {
          console.error('HTTP Error', error);
        },
      });
  }
  
  id!: number;
  submitForm(): void {
    // First, check if all required fields have values
    const missingFields = this.checkForMissingFields();

    if (missingFields.length > 0) {
        // If there are missing fields, display a warning message
        this.alertService.showAlert(
            'Missing Field',
            `The following fields are missing: ${missingFields.join(', ')}`
        );
    } else {
        // If all required fields are filled, proceed with the update
        this.updateData(this.id); // Update the data

        // Optionally, subscribe to the updateData observable and handle the success or failure
        this.http
            .put<any>(
                `http://167.172.220.75:8084/CashflowForecastingApplication/api/forecasts/${this.id}`,
                this.formData
            )
            .subscribe({
                next: (response) => {
                    if (response.code === 200 && response.status === 'success') {
                        this.alertService.showAlert('Success', 'Update successful!');

                        // Reset form data
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
                        this.router.navigate(['/listing-page']);
                    } else {
                        console.error('Failed to update data', response);
                        this.alertService.showAlert('Error', 'Failed to update data');
                    }
                },
                error: (error) => {
                    console.error('HTTP Error', error);
                    this.alertService.showAlert('Error', 'Error occurred while updating the forecast.');
                },
            });
    }
}

  cancel() {
    // this.router.navigate(['/listing-page']);
    this.location.back();
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
    // List all required fields
    const requiredFields = [
      'corporateCode',

      'forecastingAs',
      'entryType',
      'narration',
      // 'valueDate',

      'mode',

      'accountType',
      'accountNumber',
      'forecastedAmount',
    ];

    const missingFields = requiredFields.filter(
      (field) => !(this.formData as any)[field]
    );

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
    this.http

      .get<any>(url)

      .pipe(
        catchError((error: any) => {
          console.error('Error fetching account numbers:', error); 
          return throwError(() => new Error('Error fetching account numbers')); 
        })
      )
      .subscribe(
        (result: any) => { 
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

        (error: any) => {
          console.error('Subscription error:', error); 
        }
      );
  }

 // Fetch existing data by ID



}
