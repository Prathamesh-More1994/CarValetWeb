import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { IAppointment } from 'src/models/appointment';
import { ICompany } from 'src/models/company';
import { IService } from 'src/models/service';
import { IStaff } from 'src/models/staffDto';
import { IUser } from 'src/models/user';
import { CompanyServiceService } from '../services/company-service.service';
import { OwnerService } from '../services/owner.service';
import { SelectionService } from '../services/selection.service';
import { StaffServiceService } from '../services/staff-service.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit {
  isPaid: boolean = false;
  bookedSlot: any;
  timeSlot = [
    {
      slot_A: { id: 1, value: '09:00 AM ', isAvailable: true },
      slot_B: { id: 2, value: '10:00 AM ', isAvailable: true },
      slot_C: { id: 3, value: '11:00 AM ', isAvailable: true },
    },
    {
      slot_A: { id: 4, value: '12:00 PM ', isAvailable: true },
      slot_B: { id: 5, value: '01:00 PM ', isAvailable: true },
      slot_C: { id: 6, value: '02:00 PM ', isAvailable: true },
    },
    {
      slot_A: { id: 7, value: '03:00 PM ', isAvailable: true },
      slot_B: { id: 8, value: '04:00 PM ', isAvailable: true },
      slot_C: { id: 9, value: '05:00 PM ', isAvailable: true },
    },
    {
      slot_A: { id: 10, value: '06:00 PM ', isAvailable: true },
      slot_B: { id: 11, value: '07:00 PM ', isAvailable: true },
      slot_C: { id: 12, value: '08:00 PM ', isAvailable: true },
    }

  ];

  modalRef!: BsModalRef;
  bookingForm!: FormGroup
  service!: IService;
  company!: ICompany;
  user!: IUser;
  staffList: IStaff[] = [];
  constructor(
    private modalService: BsModalService,
    private _selectionService: SelectionService,
    private _companyService: CompanyServiceService,
    private fb: FormBuilder,
    private _staffService: StaffServiceService,
    private _userService: UserService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem("id")) {
      this.mocklogin();
      this.createForm();
      this.getSelectedService();
      this.getCompany();
      this.getStaffByCompany();
    }
  }

  get formValidator() {
    return this.bookingForm.controls;
  }

  //TODO: remove after 
  mocklogin() {
    this._userService.getUserByID(<string>localStorage.getItem("id"))
      .subscribe({
        next: (v) => {
          this._userService.setUser(v);
        },
        error: (e) => {
          console.error(e);
        }
      });
  }

  createForm() {
    this.bookingForm = this.fb.group({
      slot_number: ['', Validators.required],
      staff_selection: ["", [Validators.required]],
      appointment_date: ['', Validators.required],
      slot: '',
    });
  }

  getSelectedService() {
    this.service = this._selectionService.getSelectedService();
  }

  getCompany() {
    this.company = this._companyService.getCompany();
  }
  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  changeDate(evt: any) {
    this.refreshSlots();
    this.bookingForm.get('slot_number')?.setValue('');
    this.bookingForm.get('slot')?.setValue('');
    this.bookingForm.get('appointment_date')?.setValue(new Date(evt));
    this.updateSlots(new Date(evt));
  }

  updateSlots(evt: any) {
   
  }

  refreshSlots() {
    this.timeSlot.filter(data => {
      data.slot_A.isAvailable = true;
      data.slot_B.isAvailable = true;
      data.slot_C.isAvailable = true;
    });
  }

  selectSlot(id: any, slot: any) {
    this.bookingForm.get('slot_number')?.setValue(id);
    this.bookingForm.get('slot')?.setValue(slot);
  }

  bookAppointment(template: TemplateRef<any>) {

    var bookingValues = this.bookingForm.value;
    let isInvalid = false;

    Object.keys(this.bookingForm.controls).forEach(element => {
      if (this.bookingForm.controls[element].value === '') {
        this.toastr.error(element.toUpperCase() + ' is required', 'Error')
        isInvalid = true;
      }
    });

    if (!isInvalid) {
      this.user = this._userService.getUser();
      var staffValue = <IStaff>this.staffList.find(x => x.staffId === bookingValues.staff_selection);
      this.user["appointments"] = [{
        amount: this.service.price,
        timeSlot: bookingValues.slot_number,
        startTime: new Date(bookingValues.slot + 1),
        endTime: new Date(bookingValues.slot + 1),
        staff: staffValue,
        service: this.service,
        isCancelled: false,
        isCompleted: false,
        rating: 0,
        comment: ""
      }]


      this.openModal(template)

    }
  }

  cancel() {
    this.modalRef.hide();
  }


  getStaffByCompany() {
    this._staffService.getStaffByCompany(this.company.companyId)
      .subscribe({
        next: (v) => {
          if (v != null && v.length != 0) {
            this.staffList = v;
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      })
  }
}
