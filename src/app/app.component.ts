import { Component } from '@angular/core';
import { CompanyServiceService } from './services/company-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CarValetWeb';
  constructor(private companyService: CompanyServiceService) { }

  // ngOnInit() {
  //   this.companyService.getAllCompanies().subscribe(
  //     (data) => {
  //       console.log(data);
  //     }
  //   )
  // }
}
