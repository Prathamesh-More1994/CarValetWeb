import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isPartnerLogin: boolean = false;
  isLogin: boolean = false;
  isCustomer: boolean = false;
  isStaff: boolean = false;
  role: string = ""
  constructor(public router: Router,
    private _toastr: ToastrService,
    private _loginService: LoginService) { }

  ngOnInit(): void {

    this.getLogin()
    if (localStorage.getItem('id') && localStorage.getItem('role') == "Customer") {
      this.isPartnerLogin = true;
      // setTimeout(() => {
      //   localStorage.clear();
      // }, 2000)
      this.isLogin = true
    }

    if (localStorage.getItem('role') == "Staff") {
      this.isStaff = true;
      this.isLogin = true
    }

    if (localStorage.getItem('role') == "Customer") {
      this.isCustomer = true;
      this.isLogin = true
    }
  }

  getLogin() {
    this._loginService.isCustomerLoggedIn()
      .subscribe({
        next: (z) => {
          this.isCustomer = z;
        }
      })

    this._loginService.isPartnerLoggedIn()
      .subscribe({
        next: (z) => {
          this.isPartnerLogin = z;
        }
      })

    this._loginService.isStaffLoggedIn()
      .subscribe({
        next: (z) => {
          this.isStaff = z;
          
        }
      })
  }

  logout(): any {
    this.isLogin = false;
    this.isCustomer = false;
    this.isPartnerLogin = false;
    this.isStaff = false;
    this._loginService.setCustomer(false)
    this._loginService.setPartner(false)
    this._loginService.setIsStaff(false)
    localStorage.clear();
    this._toastr.success('User logged out successfully', 'Success')
    this.router.navigate(['/'])
    window.location.reload();
  }
}
