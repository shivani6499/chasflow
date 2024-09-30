import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SummaryComponent } from './summary/summary.component';
import { RejectedPageComponent } from './rejected-page/rejected-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListingPageComponent } from './listing-page/listing-page.component';
import { ReviewComponent } from './review/review.component';
import { SummaryViewComponent } from './summary-view/summary-view.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { AlertComponent } from './shared/alert/alert.component';
import { AlertServiceNew } from './shared/alert.service';   


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SummaryComponent,
    RejectedPageComponent,
    ListingPageComponent,
    ReviewComponent,
    SummaryViewComponent,
    AlertComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    EditEntryComponent,
   
    MatTableModule, 
    MatPaginatorModule,
    MatButtonModule, 

    NgxUiLoaderModule.forRoot({
      bgsColor: '#009999', 
      bgsOpacity: 0.5,   
  
      bgsSize: 60,    
      bgsType: 'rectangle-bounce', 
      pbColor: '#009999', 
      pbThickness: 5,     
    }),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: false,
   
    }),
  ],
 


  providers: [AlertServiceNew],
  bootstrap: [AppComponent],
})
export class AppModule {}
