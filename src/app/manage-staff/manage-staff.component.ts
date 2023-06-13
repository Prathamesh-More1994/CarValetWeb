import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';
import { DaysSlot } from '../constant';
import { StaffServiceService } from '../services/staff-service.service';
import { IRoster, IStaff } from 'src/models/staffDto';
import { ICompany } from 'src/models/company';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-staff',
  templateUrl: './manage-staff.component.html',
  styleUrls: ['./manage-staff.component.css']
})
export class ManageStaffComponent implements OnInit {
  @Input() company!: ICompany;
  private stepper?: Stepper;
  days = DaysSlot;
  staffDetailsForm!: FormGroup;
  shiftTimingForm!: FormGroup;

  next(): any {
    this.stepper?.next();
  }

  constructor(private _staffService: StaffServiceService,
    public fb: FormBuilder,
    private router: Router) {
    this.staffDetailsForm = this.fb.group({
      name: ['', Validators.required],
      // lname: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      expertise:['',Validators.required],
      password: ['', Validators.required]
    })

  }

  onSubmit() {

    return true;
  }

  changeTime(type: string, index: any, event: any) {
    // console.log(event.target.value)
    // console.log(this.days)
    if (type === 'isFrom') {
      this.days[index].from = event.target.value;
    } else {
      this.days[index].to = event.target.value;
    }
  }

  checkAvailable(evnt: any, index: any) {
    this.days[index]['isAvailable'] = evnt.currentTarget.checked
  }

  saveData() {
    console.log(this.company);

    var staffDetailsObj = this.staffDetailsForm.value;
    var shiftObj = this.days
    console.log(shiftObj);

    var shiftObjMap: IRoster[] = []
    shiftObj.forEach(x => {
      shiftObjMap.push({
        day: x.day,
        from: x.from,
        isAvailable: x.isAvailable,
        to: x.to,
        id: x.id
      })
    })

    var staffObj: IStaff = {
      address: staffDetailsObj.address,
      city: staffDetailsObj.city,
      email: staffDetailsObj.email,
      mobile: staffDetailsObj.mobile,
      name: staffDetailsObj.name,
      password: staffDetailsObj.name,
      shift: shiftObjMap,
      companyId: this.company.companyId,
      expertise:staffDetailsObj.expertise,
      staffId: ""
    }


    this._staffService.addStaff(staffObj)
      .subscribe({
        next: (v) => {
          this.router.navigate(["/partner"]);
          window.location.reload();
        }
      })

    return false;
  }

  ngOnInit() {
    const el = document.querySelector('#stepper2');
    if (el) {
      this.stepper = new Stepper(el, {
        linear: false,
        animation: true
      })
    }

  }
}


