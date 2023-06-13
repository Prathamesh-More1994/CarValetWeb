import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompanyServiceService } from '../services/company-service.service';
import { LoginService } from '../services/login.service';
import { OwnerService } from '../services/owner.service';
import { StaffServiceService } from '../services/staff-service.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLogin: boolean = false;
  loginForm!: FormGroup
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private _userService: UserService,
    private _ownerSerivce: OwnerService,
    private _staffService: StaffServiceService,
    private toastr: ToastrService,
    private _loginService: LoginService) { }
  ngOnInit(): void {
    // if (localStorage.getItem('id')) {
    //   localStorage.getItem('isDoctor') ? this.router.navigate(['/pages/appointments/view-appointments']) : this.router.navigate(['/pages/appointments/search'])
    // } else {
    //   this.createForm();
    // }

    this.createForm();
  }


  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+353-?)|0)?[0-9]{9}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  get formValidator() {
    return this.loginForm.controls;
  }

  registerPartner() {
    this.router.navigate(['/partner-us'])
  }

  login() {
    let requestObj = this.loginForm.value;
    if (requestObj['role'] === 'Customer') {
      this.userlogin(requestObj)
    }
    else if (requestObj['role'] === 'Partner') {
      this.partnerLogin(requestObj);
    }
    else if (requestObj['role'] === 'Staff') {
      this.staffLogin(requestObj);
    }
    else { this.toastr.error('Please enter valid credentials.') }

  }

  partnerLogin(requestObj: any) {
    this._ownerSerivce.loginOwner(requestObj).subscribe({
      next: (v) => {
        if (v) {
          //this.spinnerService.hide();
          console.log(v)
          localStorage.setItem('role', requestObj['role'])
          localStorage.setItem('id', v.ownerId)
          localStorage.setItem('name', v.name)
          //this._userService.setUser(v);
          this.toastr.success('Logged in successfully!', 'Success');
          this._loginService.setPartner(true);
          this.isLogin = true;

          this.router.navigate(['/partner'])
          //window.location.reload();
        } else {
          //this.spinnerService.hide();
          //this.showLoginError = true;
          this.toastr.error('Please enter valid credentials.')
        }
        console.log(v);
      }, error: (err) => {
        (err: any) => {
          //this.spinnerService.hide();
          this.toastr.error(err['error']['message'] ? err['error']['message'] : 'Please enter valid credentials!', 'Error');
        }
      }
    });
  }

  userlogin(requestObj: any) {
    this._userService.loginUser(requestObj).subscribe({
      next: (v) => {
        if (v) {
          //this.spinnerService.hide();
          console.log(v)
          localStorage.setItem('role', requestObj['role'])
          localStorage.setItem('id', v.userId)
          localStorage.setItem('name', v.name)
          this._userService.setUser(v);
          this._loginService.setCustomer(true);
          this.toastr.success('Logged in successfully!', 'Success');
          this.isLogin = true;
          this.router.navigate(['/'])
          window.location.reload();


        } else {
          this.toastr.error('Please enter valid credentials.')
        }
        console.log(v);
      }, error: (err) => {
        (err: any) => {
          this.toastr.error(err['error']['message'] ? err['error']['message'] : 'Please enter valid credentials!', 'Error');
        }
      }
    });
  }

  staffLogin(requestObj: any) {
    this._staffService.loginStaff(requestObj).subscribe({
      next: (v) => {
        if (v) {
          //this.spinnerService.hide();
          console.log(v)
          localStorage.setItem('role', requestObj['role'])
          localStorage.setItem('id', v.staffId)
          localStorage.setItem('name', v.name)
          //this._userService.setUser(v);
          this.toastr.success('Logged in successfully!', 'Success');
          this._loginService.setIsStaff(true);
          this.router.navigate(['/staff'])

          this.isLogin = true;
          window.location.reload();
        } else {
          //this.spinnerService.hide();
          //this.showLoginError = true;
          this.toastr.error('Please enter valid credentials.')
        }
        console.log(v);
      }, error: (err) => {
        (err: any) => {
          //this.spinnerService.hide();
          this.toastr.error(err['error']['message'] ? err['error']['message'] : 'Please enter valid credentials!', 'Error');
        }
      }
    });
  }

  registerUser(): any {
    this.loginForm.controls["role"].setValue("Customer")
    let isInvalid = false;
    Object.keys(this.loginForm.controls).forEach(element => {
      if (this.loginForm.controls[element].value === '') {
        this.toastr.error(element.toUpperCase() + ' is required', 'Error')
        isInvalid = true;
      }
    });

    if (!isInvalid) {
      let requestObj = this.loginForm?.value;
      this._userService.registerUser(requestObj)
        .subscribe({
          next: (v) => {
            this.toastr.success('User Registered successfully, check your mail for the confirmation!', 'Success');
            this.loginForm.reset();
            this.isLogin = true;
            this.loginForm.controls["role"].setValue("")
            window.location.reload();
          }
          , error: (err) => {
            {
              this.toastr.error(err['error']['message'] ? err['error']['message'] : 'Something went wrong!', 'Error');
              console.log(err['error']['message'])
            }
          }
        });
    }
  }

}