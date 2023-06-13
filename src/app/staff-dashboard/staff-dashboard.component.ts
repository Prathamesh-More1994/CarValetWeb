import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss']
})
export class StaffDashboardComponent implements OnInit {

  isClocked: boolean = false;
  constructor(private toastr:ToastrService) { }

  ngOnInit(): void {
    
  }

  clockIn() {
    // this.toastr.success("Completed","Success")
    // this.toastr.warning("Already Clocked In","Warning")
    // this.toastr.error("Invalid credentials","Error")
  }

  clockOut() {

  }

  getAppointment() {

  }

}
