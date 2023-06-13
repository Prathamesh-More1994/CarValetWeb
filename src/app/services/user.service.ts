import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAppointment } from 'src/models/appointment';
import { IAppointmentDto } from 'src/models/appointmentDto';
import { ICompany } from 'src/models/company';
import { IUser } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user_url: string = 'https://localhost:7164/users';
  private user!: IUser;

  constructor(private _httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  getUserByID(id: string): Observable<any> {
    var userId = id
    return this._httpClient.get(this.user_url + "/" + userId);
  }

  getStaffAppointmentByID(id: string): Observable<any> {
    var staffId = id
    return this._httpClient.get(this.user_url + "/staff?staffid=" + staffId);
  }

  setUser(user: IUser) {
    this.user = user;
  }

  getUser(): IUser {
    return this.user;
  }

  updateUser(user: IUser): Observable<any> {
    return this._httpClient.post(this.user_url + "/updateUser", user, this.httpOptions);
  }

  registerUser(user: IUser): Observable<any> {
    return this._httpClient.post(this.user_url, user, this.httpOptions);
  }

  loginUser(user: IUser): Observable<any> {
    return this._httpClient.post(this.user_url + "/login", user, this.httpOptions)
  }

  getAppointments(company: ICompany): Observable<IAppointmentDto[]> {
    return this._httpClient.post<IAppointmentDto[]>(this.user_url + "/appointment", company, this.httpOptions)
  }

  updateAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this._httpClient.post<IAppointment>(this.user_url + "/update", appointment, this.httpOptions)
  }

  cancelAppointment(appointment:IAppointment):Observable<IAppointment>{
    return this._httpClient.post<IAppointment>(this.user_url + "/cancel", appointment, this.httpOptions)
  }

  addRatingAppointment(appointment:IAppointment):Observable<IAppointment>{
    return this._httpClient.post<IAppointment>(this.user_url + "/rate", appointment, this.httpOptions)
  }

}
