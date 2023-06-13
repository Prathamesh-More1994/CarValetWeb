import { Component, OnInit } from '@angular/core';
import { ICompany, ILocation } from 'src/models/company';
import { CompanyServiceService } from '../services/company-service.service';
import { DatePipe } from '@angular/common';
import { LocationService } from '../services/location.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-companies',
  templateUrl: './view-companies.component.html',
  styleUrls: ['./view-companies.component.css']
})
export class ViewCompaniesComponent implements OnInit {

  companyList: ICompany[] = [];
  constructor(private _companyService: CompanyServiceService,
    private _locationService: LocationService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllCompanies();
  }

  bookAppointment(company: ICompany) {
    
    if (localStorage.getItem("id") != null) {
      this._companyService.setCompany(company);
      this.router.navigate(['/service'])
    } else {
      this.toastr.warning("Please Login First", "No Login found")
      this.router.navigate(['/login']);
    }
  }

  getAllCompanies() {
    this._companyService.getCompaniesList()
      .subscribe({
        next: (v) => {
          if (v != null && v.length != 0) {
            this.companyList = v;
          }
          else {
            this.getLocation();
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      });
  }

  getLocation(): void {
    this._locationService.getPosition().then(pos => {
      var location: ILocation = {
        latitude: pos.lng,
        longitude: pos.lat
      };

      this._companyService.getAllCompaniesByLocation(location)
        .subscribe(data => {
          this._companyService.setCompaniesList(data);
        })
    }).catch(err => {
      console.log(err);
    })
  }
}
