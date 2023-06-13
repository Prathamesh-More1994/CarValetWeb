import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IService } from 'src/models/service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  private company_url: string = 'https://localhost:7164/company';
  //private companies: ICompany[] = [];

  private selectedService!: IService;
  constructor(private _httpClient: HttpClient) {
    // Http Headers
  }

  setSelectedService(service: IService) {
    this.selectedService = service;
  }

  getSelectedService(): IService {
    return this.selectedService;
  }
}
