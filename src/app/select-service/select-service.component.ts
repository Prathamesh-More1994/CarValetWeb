import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICompany } from 'src/models/company';
import { IService } from 'src/models/service';
import { CompanyServiceService } from '../services/company-service.service';
import { SelectionService } from '../services/selection.service';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.component.html',
  styleUrls: ['./select-service.component.css']
})
export class SelectServiceComponent implements OnInit {

  company!: ICompany;
  constructor(private _companyService: CompanyServiceService, private _selectionService: SelectionService, private router: Router) { }

  ngOnInit(): void {
    this.company = this._companyService.getCompany();
  }

  selectService(service: IService) {
    this._selectionService.setSelectedService(service);
    this.router.navigate(['/book'])
  }
}
