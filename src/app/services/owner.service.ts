import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOwner } from 'src/models/owner';
import { IStaff } from 'src/models/staffDto';


@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }
  private owner_url: string = "https://localhost:7164/owner";
  constructor(private _httpClient: HttpClient) { }


  loginOwner(owner: IOwner): Observable<any> {
    return this._httpClient.post(this.owner_url + "/login", owner, this.httpOptions)
  }
}
