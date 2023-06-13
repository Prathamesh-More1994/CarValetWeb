import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICompany, ILocation } from 'src/models/company';
import { IOwner } from 'src/models/owner';
import { ICompanyDto } from 'src/models/companyDto';


@Injectable({
  providedIn: 'root'
})

export class CompanyServiceService {

  private company_url: string = 'https://localhost:7164/company';


  private companiesSubject = new BehaviorSubject<ICompany[]>([])
  private selectedCompany!: ICompany;
  constructor(private _httpClient: HttpClient) {
    // Http Headers
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  getAllCompanies(): Observable<any> {
    return this._httpClient.get(this.company_url);
  }

  getAllCompaniesByLocation(location: ILocation): Observable<any> {
    return this._httpClient.post(this.company_url + "/location", location, this.httpOptions);
  }

  getCompaniesByName(searchText: any): Observable<any> {
    return this._httpClient.post(this.company_url + "/search", searchText, this.httpOptions);
  }

  getCompanyByID(id: number): Observable<any> {
    return this._httpClient.get(this.company_url + '/{id}');
  }

  getCompanyByOwner(owner: IOwner): Observable<any> {
    return this._httpClient.post(this.company_url + "/staff", owner, this.httpOptions)
  }

  createCompany(company: any): Observable<any> {
    return this._httpClient.post<any>(this.company_url + "/createCompany", company, this.httpOptions);
  }

  updateCompany(company: any): Observable<any> {
    return this._httpClient.put(this.company_url, company);
  }

  updateCompanyForStaff(company: any): Observable<any> {
    return this._httpClient.put(this.company_url + "/staff", company);
  }
  deleteCompany(id: number): Observable<any> {
    return this._httpClient.delete(this.company_url + '/{id}');
  }

  setCompany(company: ICompany) {
    this.selectedCompany = company
  }

  getCompany() {
    return this.selectedCompany;
  }

  setCompaniesList(companies: ICompany[]) {
    this.companiesSubject.next(companies)
  }

  getCompaniesList(): Observable<ICompany[]> {
    return this.companiesSubject.asObservable()
  }

  throwError(error: any): any {
    console.error(error);
    //return Observable.throw(error.json().error||'Server error');
  }
}
