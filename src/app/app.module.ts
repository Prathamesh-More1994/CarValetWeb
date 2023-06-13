import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanyServiceService } from './services/company-service.service';
import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import {
  IgxCalendarModule,
  IgxDialogModule
} from "igniteui-angular";
// import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ViewCompaniesComponent } from './view-companies/view-companies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from './services/location.service';
import { OwnerService } from './services/owner.service';
import { UserService } from './services/user.service';
import { LoginComponent } from './login/login.component';
import { SelectServiceComponent } from './select-service/select-service.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { PartnerUsComponent } from './partner-us/partner-us.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';
import { ToastrModule } from 'ngx-toastr';
import { PartnerDashboardComponent } from './partner-dashboard/partner-dashboard.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaymentComponent } from './payment/payment.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgChartsModule  as Ng2Charts } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    ViewCompaniesComponent,
    LoginComponent,
    SelectServiceComponent,
    BookAppointmentComponent,
    ManageStaffComponent,
    PartnerUsComponent,
    ViewAppointmentComponent,
    PartnerDashboardComponent,
    StaffDashboardComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    FontAwesomeModule,
    NgxStarRatingModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HammerModule,
    IgxCalendarModule,
    IgxDialogModule,
    Ng2Charts,
    // AutocompleteLibModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    ModalModule.forRoot()

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CompanyServiceService, LocationService, OwnerService, UserService, BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
