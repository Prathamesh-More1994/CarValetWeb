import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChartType } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { IAppointment } from 'src/models/appointment';
import { IAppointmentDto } from 'src/models/appointmentDto';
import { ICompany } from 'src/models/company';
import { IOwner } from 'src/models/owner';
import { IPayment } from 'src/models/payment';
import { IPaymentDto } from 'src/models/paymentDto';
import { IStaff } from 'src/models/staffDto';
import { CompanyServiceService } from '../services/company-service.service';
import { OwnerService } from '../services/owner.service';
import { PaymentService } from '../services/payment.service';
import { StaffServiceService } from '../services/staff-service.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-partner-dashboard',
  templateUrl: './partner-dashboard.component.html',
  styleUrls: ['./partner-dashboard.component.scss']
})
export class PartnerDashboardComponent implements OnInit {

  lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Revenue' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    // { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
  ];
  
  lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartOptions: any = {
    responsive: true
  };
  lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  
  lineChartLegend = true;
  lineChartType:ChartType = 'line';
  staffList: IStaff[] = [];
  owner!: IOwner;
  company!: ICompany;
  transactionData!: IPaymentDto
  transactionList: IPayment[] = [];
  appointmentCount: number = 0;
  //appointmentList: IAppointment[] = [];
  appointmentData: IAppointmentDto[] = [];
  completedCount: number = 0;
  pendingCount: number = 0;
  form2!: FormGroup;
  constructor(private _companyService: CompanyServiceService,
    private _staffService: StaffServiceService,
    private toastr: ToastrService,
    private _ownerSerivce: OwnerService,
    private _userService: UserService,
    private _paymentService: PaymentService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getOwner();
    this.getCompanyByOwner();
    this.form2 = this.fb.group({
    })
  }

  getOwner() {
    if (localStorage.getItem("id")) {
      this.owner = {
        ownerId: <string>localStorage.getItem('id'),
        email: "",
        mobile: "",
        name: "",
        password: ""
      }
    }
  }

  staffListChangedParent(staff: any) {
    this.staffList.push(staff);
  }

  getCompanyByOwner() {
    this._companyService.getCompanyByOwner(this.owner)
      .subscribe(
        {
          next: (v) => {
            this.company = v;
            this.getTransactions();
            this.getAppointments();
            //console.log(this.company);
            this._staffService.getStaffByCompany(this.company.companyId)
              .subscribe({
                next: (x) => {
                  //console.log(x);
                  this.staffList = x
                }
              })
          }
        }
      )
  }

  getTransactions() {
    this._paymentService.getPaymentsByOwner(this.company)
      .subscribe({
        next: (v) => {

          this.transactionData = v;
        }
      })
  }

  getAppointments() {
    this._userService.getAppointments(this.company)
      .subscribe({
        next: (v) => {
          var completedTasks = 0;
          var pendingTasks = 0;
          //this.appointmentList = v.appointments;
          var i = 0;
          this.appointmentData = v;
          if (this.appointmentData.length > 0) {
            this.appointmentData.forEach(z => {
              if (z.appointment.isCompleted) {
                completedTasks++;
              }
              else {
                pendingTasks++;
              };
              var name = "ratings" + i
              this.form2.addControl(name, new FormControl(z.appointment.rating))
            })

            this.appointmentCount = this.appointmentData.length;

            //this.appointmentCount = this.appointmentData.length;
            this.completedCount = completedTasks * 100 / this.appointmentCount;
            this.pendingCount = pendingTasks;
          }
        }
      })
  }







  //-------------------chart area--------------------------------

  

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }


}
