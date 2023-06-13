import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private isPartner = new BehaviorSubject<boolean>(false)
  private isCustomer = new BehaviorSubject<boolean>(false)
  private isStaff = new BehaviorSubject<boolean>(false)

  constructor() { }

  isPartnerLoggedIn(): Observable<any> {
    return this.isPartner.asObservable();
  }
  
  isCustomerLoggedIn(): Observable<any> {
    return this.isCustomer.asObservable();
  }

  isStaffLoggedIn(): Observable<any> {
    return this.isStaff.asObservable();
  }

  setPartner(value: boolean) {
    this.isPartner.next(value);
  }
  setCustomer(value: boolean) {
    this.isCustomer.next(value);
  }
  setIsStaff(value: boolean) {
    this.isStaff.next(value);
  }

}
