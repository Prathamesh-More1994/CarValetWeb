import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { PartnerDashboardComponent } from './partner-dashboard/partner-dashboard.component';
import { PartnerUsComponent } from './partner-us/partner-us.component';
import { PaymentComponent } from './payment/payment.component';
import { SelectServiceComponent } from './select-service/select-service.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';
import { ViewCompaniesComponent } from './view-companies/view-companies.component';

const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'viewCompanies', component: ViewCompaniesComponent },
  { path: "login", component: LoginComponent },
  { path: "service", component: SelectServiceComponent },
  { path: "book", component: BookAppointmentComponent },
  { path: 'partner-us', component: PartnerUsComponent },
  { path: 'manage-staff', component: ManageStaffComponent },
  { path: 'appointment', component: ViewAppointmentComponent },
  { path: 'partner', component: PartnerDashboardComponent },
  { path: 'staff', component: StaffDashboardComponent },
  { path: 'payment', component: PaymentComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // redirect to `first-component`
  //{ path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
