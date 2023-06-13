import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICompany, ILocation } from 'src/models/company';
import { CompanyServiceService } from '../services/company-service.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  keyword: string = "companyName";
  allCompanyList: ICompany[] = [];

  searchText: string = "";

  constructor(private _companyService: CompanyServiceService,
    private _locationService: LocationService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // this._companyService.getAllCompanies()
    //   .subscribe((data) => {
    //     this.allCompanyList = data;
    //     //console.log(this.allCompanyList);
    //   })
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
          this.router.navigate(['/viewCompanies']);
        })
    }).catch(err => {
      console.log(err);
    })
  }

  search(): void {
    var name = JSON.stringify(this.searchText);
    this._companyService.getCompaniesByName(name)
      .subscribe(data => {
        if (data.length != 0) {
          this._companyService.setCompaniesList(data);
          this.router.navigate(['/viewCompanies']);
        }
        else {
          this.toastr.error("Try searching with different keyword", "Not Found");
        }
      })
  }
}
