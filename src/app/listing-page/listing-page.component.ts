import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from 'src/app/utils/api';
import { Router } from '@angular/router';
import { AlertService } from '../utils/aleartService';


@Component({
  selector: 'app-listing-page',
  templateUrl: './listing-page.component.html',
  styleUrls: ['./listing-page.component.css'],
})
export class ListingPageComponent implements OnInit {
  loading: boolean = false;
  error: string | null = null;
  cancelIcon = baseUrl + 'pending-list/reject/';
  rejectPost = baseUrl + 'rejectAll';
  selectedId: number[] = [];
  selectedIds: number[] = [];
  rejectionReason: string = '';
  tickBoxClick: boolean = true;
  isChecked: boolean = false;
  showAdditionalColumns: boolean = false;
  tickBox: boolean = false;
  rejectAll: boolean = false;
  authorizeAll: boolean = false;
  hideOnlyPending: boolean = false;
  showOnlyPending: boolean = false;
  results: any[] = [];
  data: any[] = [];
  selectedOption: number = 0;
  searchValue: string = '';
  popupId: any;
  singleselectedId: any = [];

  currentStatus: 'rejected' | 'pending' | 'review' | null = null;
  isLoading = true;

  ngOnInit() {
    
  this.singleselectedId = [];
    this.loadPendingData();
    this.checkedItems = this.results.map(() => true);
  }

  onOptionChange() { 
  }

  setStatus(status: 'rejected' | 'pending' | 'review') {
    this.currentStatus = status; 
  }

  searchParam = '';
  search() {
    this.loading = true;
    this.error = null;

    if (!this.currentStatus) {
      this.alertService.showAlert(
        'Error',
        'Please select any one Of this reject, pending, or review first'
      ); 
      this.loading = false;
      return;
    }
 
    if (!this.searchValue || this.searchValue.trim() === '') {
      this.alertService.showAlert('Error', 'Enter the search value first');
      this.loading = false;
      return; 
    }
    this.loading = true; 

    let apiUrl = '';
    switch (this.selectedOption * 1) {
      case 0:
        this.searchParam = 'referenceNo';
        break;
      case 1:
        this.searchParam = 'corporateCode';
        break;
      case 2:
        this.searchParam = 'corporateName';
        break;
      case 3:
        this.searchParam = 'forecastingAs';
        break;
      case 4:
        this.searchParam = 'entryType';
        break;
      default:
        this.searchParam = 'referenceNo';
    } 
    if (this.currentStatus === 'rejected') {
      apiUrl =
        baseUrl +
        'rejected/search?' +
        this.searchParam +
        '=' +
        this.searchValue;
    }
    if (this.currentStatus === 'pending') { 
      apiUrl =
        baseUrl +
        'pending-list/search?' +
        this.searchParam +
        '=' +
        this.searchValue;
    }
    if (this.currentStatus === 'review') {
      apiUrl =
        baseUrl +
        'review-list/search?' +
        this.searchParam +
        '=' +
        this.searchValue;
    }
    apiUrl + '&page=0&size=2'; 
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.loading = false; 
        if (response.code === 200 && response.data && response.data.content) {
          this.results = response.data.content;
        } else {
          this.alertService.showAlert('Error', 'Data not found'); 
          this.results = [];
        }
      },
      (error) => {
        this.loading = false; 
        this.results = [];
      }
    );
  }

  //

  navigateToEdit(id: number) { 
    this.router.navigate(['/edit-entry', id]); 
  }

  rejectBtn() {
    this.results = [];
    this.showOnlyPending = false;
    this.hideOnlyPending = true;
    this.rejectAll = false;
    this.showAdditionalColumns = false;
    this.authorizeAll = false; 
    this.rejectBtnApi();
    this.setStatus('rejected');
    this.showAdditionalColumns = true;
    this.tickBox = false; 
  }

  reviewBtn() {
    this.results = [];
    this.showOnlyPending = false;
    this.hideOnlyPending = true;
    this.showAdditionalColumns = false;
    this.tickBox = false;
    this.rejectAll = false;
    this.authorizeAll = false; 
    this.reviewBtnApi();
    this.setStatus('review');
  }

  pendingBtn() {
    this.results = []; 
    this.loadPendingData();
    this.showOnlyPending = true;
    this.hideOnlyPending = false;
    this.showAdditionalColumns = false;
    this.setStatus('pending');
  }

  checkedItems: boolean[] = [];
  rejectIDS: any = [];

  toggleCheckbox(event: any, id: number): void { 
    const isChecked = event.target.checked; 
    const index = this.selectedIds.indexOf(id); 
    if (isChecked && index === -1) { 
      this.selectedIds.push(id);
    } else if (!isChecked && index > -1) {
      this.selectedIds.splice(index, 1); 
    }

    // Update the checkedItems array
    const resultIndex = this.results.findIndex((item) => item.id === id);
 
    if (resultIndex > -1) {
      this.checkedItems[resultIndex] = isChecked; 
    } 
  }

  toggleHeaderCheckbox(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isChecked = isChecked;
    this.checkedItems = new Array(this.results.length).fill(isChecked);

    if (isChecked) {
      this.selectedIds = this.results.map((item) => item.id);
    } else {
      this.selectedIds = [];
    } 
  }

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router
  ) {}

  allData: any[] = [];

  filterDataObj = {
    page: 0,
    size: 50,
  };
  onPrevious() {
    if (this.filterDataObj.page > 0) {
      this.filterDataObj.page--;
      this.loadPendingData();
      this.reviewBtnApi();
      this.rejectBtn();
    }
  }
  onNext() {
    this.filterDataObj.page++;
    this.loadPendingData();
    this.reviewBtnApi();
    this.rejectBtn();
  }

  loadPendingData() {
    this.results = [];
    this.tickBox = true;
    this.rejectAll = true;
    this.authorizeAll = true;
    this.isLoading = true;
    this.showOnlyPending = true;
    this.hideOnlyPending = false;
    this.showAdditionalColumns = false;
    this.rejectionReason = '';
    this.setStatus('pending');
    const params = new HttpParams()
      .set('page', this.filterDataObj.page.toString())
      .set('size', this.filterDataObj.size.toString());
    this.http.get<any>(baseUrl + 'pending-list', { params }).subscribe({
      next: (response) => { 
        if (response && response.data && response.data.content) {
          this.results = response.data.content;
          this.checkedItems = new Array(this.results.length).fill(false);
        } else { 
          // this.alertService.showAlert('Error', 'No entry found');
        }
        this.isLoading = false;
      },
      error: (error) => { 
        this.isLoading = false;
        // this.alertService.showAlert('Error', 'No data found');
      },
    });
  }

  id: number = 0;
  view(event: MouseEvent, id: number) { 
    this.router.navigate(['/review', id]);
  }

  private reviewBtnUrl = baseUrl + 'review-list';
  private rejectBtnUrl = baseUrl + 'rejected';

  rejectBtnApi(): void {
    this.loading = true;
    this.loadRejectData().subscribe(
      (response) => { 
        this.results = response.data.content || [];
      },
      (error) => {
        setTimeout(() => {
          this.loading = false;
          this.alertService.showAlert('Error', 'Search request failed'); 
        }, 2000);
      }
    );
  }

  private loadRejectData(): Observable<any> {
    const params = new HttpParams()
      .set('page', this.filterDataObj.page.toString())
      .set('size', this.filterDataObj.size.toString());
    return this.http.get<any>(this.rejectBtnUrl, { params }).pipe(
      catchError((error) => { 
        return of({ data: [] }); // Return an empty result on error
      })
    );
  }

  reviewBtnApi(): void {
    this.results = [];
    this.loading = true;
    const params = new HttpParams()
      .set('page', this.filterDataObj.page.toString())
      .set('size', this.filterDataObj.size.toString());
    this.http
      .get<any>(baseUrl + 'review-list', { params })
      .subscribe((response) => { 
        this.results = response.data?.content || [];
        this.loading = false;
      });
  }

  isDialogVisible = false;
  isPopupVisible = false; 
  showPopupIcon(id: any) {
    this.singleselectedId.push(id);
    this.isDialogVisible = true;
  }

  showPopupBtn() {
    if (this.selectedIds.length === 0) {
      this.alertService.showAlert('Error', 'Please select rejected item');
      return;
    } else {
      this.singleselectedId = [];
      this.isDialogVisible = true;
    }
  }

  onCancelIcon() {
    this.isDialogVisible = false;
  }

  onCancel1() {
    this.isPopupVisible = false;
  } 

 datarejected:any  
  byIcon() { 
     this.isDialogVisible = true;
    if (!this.rejectionReason) {
      this.alertService.showAlert('Warning', 'Please enter a rejection reason');
      return;
    }
  if (this.singleselectedId.length ===0) {
    if (this.selectedIds.length === 0) {
    this.alertService.showAlert('Warning', 'Please select an item to reject');
    return;
  }  
   this.datarejected = {
    rejectionReason: this.rejectionReason,
      ids: this.selectedIds,
  }
}
if (this.singleselectedId.length !==0) { 
  this.datarejected = {
    rejectionReason: this.rejectionReason,
      ids: this.singleselectedId,
  }
} 
  
    this.http.post(`${baseUrl}rejectAll`, this.datarejected).subscribe(
      (response) => {
        this.alertService.showAlert('Success', 'Entry rejected successfully.'); 
        this.isDialogVisible = false;
        this.loadPendingData();
        this.checkedItems = this.results.map(() => true);
        this.singleselectedId = [];
        this.rejectionReason = '';
      },
      (error) => { 
        this.alertService.showAlert(
          'Error',
          'An error occurred while rejecting the entry.'
        );
      }
    );
    this.isDialogVisible = false;
  }

  authorizeBtn() {
    if (this.selectedIds.length === 0) {
      this.alertService.showAlert(
        'Warning',
        'Please select items to authorize'
      );
      return;
    } 
 
    this.http
      .post(baseUrl + 'pending-list/authorizeAll', this.selectedIds)
      .subscribe(
        (response) => {
          this.alertService.showAlert(
            'Success',
            'Your data is verified to authorize'
          );
          this.loadPendingData();
        this.checkedItems = this.results.map(() => true);
        this.singleselectedId = [];
        this.rejectionReason = ''; 
        },
        (error) => {
          console.log('Error:', error);
        }
      );
  }
  

  rightIconApi(event: MouseEvent, id: number) {
    this.http.post(baseUrl + 'pending-list/authorize/' + id, null).subscribe(
      (response) => {
        this.alertService.showAlert('Success', 'Your data is ready to review'); 
        this.loadPendingData();
        this.checkedItems = this.results.map(() => true);
        this.singleselectedId = [];
        this.rejectionReason = '';
      },
     
      
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
