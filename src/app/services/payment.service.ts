import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICompany } from 'src/models/company';
import { IPayment } from 'src/models/payment';
import { IResponse } from 'src/models/response';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private payment_url: string = 'https://localhost:7164/Payment';
  headers = new HttpHeaders({ "Content-Type": "application/json" });
  options = new HttpResponse({ headers: this.headers });
  private dataSubject = new BehaviorSubject<any>("")

  constructor(private _httpClient: HttpClient) { }

  pay(bodyString: string): Observable<IResponse> {
    return this._httpClient.post<IResponse>(this.payment_url + "/create", bodyString, this.options)
  }

  addPayment(paymentData: IPayment) {
    return this._httpClient.post(this.payment_url + "/add", paymentData, this.options)
  }

  saveData(data: any) {
    console.log(data);

    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  getPaymentsByOwner(company: ICompany): Observable<any> {
    return this._httpClient.post(this.payment_url + "/owner", company, this.options)
  }
}
