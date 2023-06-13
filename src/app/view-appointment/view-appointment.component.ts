import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { IAppointment } from 'src/models/appointment';
import { IUser } from 'src/models/user';
import { PaymentService } from '../services/payment.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.scss']
})
export class ViewAppointmentComponent implements OnInit {
  modalRef!: BsModalRef;
  appointmentList!: IAppointment[];
  appointmentTemp!: IAppointment;
  today = new Date();
  index: any;
  user!: IUser;
  ratingNumber: number = 0;
  form!: FormGroup;
  form2!: FormGroup;
  isStaff: boolean = false;

  @ViewChild('templateReview') templateRef1!: TemplateRef<any>;
  constructor(private modalService: BsModalService,
    private _userService: UserService,
    private _paymentService: PaymentService,
    private toastr: ToastrService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this._paymentService.getData()
      .subscribe({
        next: (v) => {
          // console.log(v);
        }
      })
    this.createForm();
    if (localStorage.getItem("id") && localStorage.getItem("role") === "Customer") {
      this.isStaff = false;
      this.getAppointment();
    }
    else if (localStorage.getItem("id") && localStorage.getItem("role") === "Staff") {
      this.isStaff = true;
      this.getStaffAppointment();
    }
  }

  createForm() {
    this.form = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required]
    })

    this.form2 = this.fb.group({
    })


  }

  getAppointment() {
    this._userService.getUserByID(<string>localStorage.getItem("id"))
      .subscribe({
        next: (v) => {
          this._userService.setUser(v);
          this.user = v;
          this.appointmentList = this.user.appointments;
          var i = 0;
          this.appointmentList.forEach(z => {
            if (z.isCompleted && z.rating == 0) {
              this.openModal(this.templateRef1, z);
            }
            console.log(i);

            var name = "ratings" + i
            this.form2.addControl(name, new FormControl(z.rating))

          })
          console.log(this.form2);

        },
        error: (e) => {
          console.error(e);
        }
      });

  }

  getStaffAppointment() {
    this._userService.getStaffAppointmentByID(<string>localStorage.getItem("id"))
      .subscribe({
        next: (v) => {
          console.log(v);

          this.appointmentList = v;
          var i = 0;
          this.appointmentList.forEach(z => {
            // if (z.isCompleted && z.rating == 0) {
            //   this.openModal(this.templateRef1, z);
            // }
            console.log(i);

            var name = "ratings" + i
            this.form2.addControl(name, new FormControl(z.rating))

          })
          console.log(this.form2);

        },
        error: (e) => {
          console.error(e);
        }
      });
  }

  openModal(template: TemplateRef<any>, item: IAppointment) {
    this.modalRef = this.modalService.show(template);
    this.appointmentTemp = item;
  }

  onComplete() {
    if (localStorage.getItem("role") === "Staff") {
      return false;
    }
    return true;
  }

  onStaffComplete(item: IAppointment) {
    this._userService.updateAppointment(item)
      .subscribe({
        next: (z) => {
          this.toastr.success("Completed", "Status")
          this.getStaffAppointment();
        }
      })
  }

  cancel(index: any) {
    this.index = index
  }

  cancelAppointment(flag: any) {
    if (!flag) {
      this.modalRef.hide()
    } else {

      this._userService.cancelAppointment(this.appointmentTemp)
        .subscribe({
          next: (v) => {
            this.getStaffAppointment();
          }
        })
      this.modalRef.hide()
    }
  }

  submitReview(flag: boolean) {
    if (!flag) {
      this.modalRef.hide()
    } else {
      var ratingValues = this.form.value;
      let isInvalid = false;
      Object.keys(this.form.controls).forEach(element => {
        if (this.form.controls[element].value === '') {
          this.toastr.error(element.toUpperCase() + ' is required', 'Error')
          isInvalid = true;
        }
      });

      if (!isInvalid) {
        this.appointmentTemp.rating = ratingValues.rating;
        this.appointmentTemp.comment = ratingValues.comment;
        this._userService.addRatingAppointment(this.appointmentTemp)
          .subscribe({
            next: (z) => {
              this.toastr.success("Completed", "Status")
              this.getStaffAppointment();
            }
          })
      }
    }
  }
}
