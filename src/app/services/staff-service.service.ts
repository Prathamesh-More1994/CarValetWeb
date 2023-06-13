import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IStaff } from 'src/models/staffDto';

@Injectable({
  providedIn: 'root'
})
export class StaffServiceService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  private staff_url: string = 'https://localhost:7164/staff';
  constructor(private _httpClient: HttpClient) { }

  addStaff(staff: IStaff): Observable<any> {
    return this._httpClient.post(this.staff_url, staff, this.httpOptions)
  }

  getStaffByCompany(id: string): Observable<any> {
    var companyId = JSON.stringify(id);
    return this._httpClient.post(this.staff_url + "/companyStaff", companyId, this.httpOptions);
  }

  loginStaff(staff: IStaff): Observable<any> {
    return this._httpClient.post(this.staff_url + "/login", staff, this.httpOptions)
  }
}
