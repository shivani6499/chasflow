import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { ManualFourRowComponent } from './manual-four-row/manual-four-row.component';
import { ManualThreeRowComponent } from './manual-three-row/manual-three-row.component';
import { RejectedPageComponent } from './rejected-page/rejected-page.component';
import { ListingPageComponent } from './listing-page/listing-page.component';
import { ReviewComponent } from './review/review.component';
import { SummaryViewComponent } from './summary-view/summary-view.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';

// Define the routes for the application
const routes: Routes = [
  { path: '', component: ManualFourRowComponent }, // Default route, loads ManualFourRowComponent
  { path: 'summary', component: SummaryComponent }, // Route for SummaryComponent
  { path: 'manual-four', component: ManualFourRowComponent }, // Route for ManualFourRowComponent
  { path: 'manual-three', component: ManualThreeRowComponent }, // Route for ManualThreeRowComponent
  { path: 'rejected-list', component: RejectedPageComponent }, // Route for RejectedPageComponent
  { path: 'summary-view/:year/:month', component: SummaryViewComponent }, // Route with parameters for year and month
  { path: 'listing-page', component: ListingPageComponent }, // Route for ListingPageComponent
  { path: 'summary-view', component: SummaryViewComponent }, // Route for SummaryViewComponent (without parameters)
  { path: 'review/:id', component: ReviewComponent }, // Route for ReviewComponent with 'id' parameter
  { path: 'edit-entry/:id', component: EditEntryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import RouterModule and configure it with the routes
  exports: [RouterModule], // Export RouterModule to make it available throughout the app
})
export class AppRoutingModule {}
