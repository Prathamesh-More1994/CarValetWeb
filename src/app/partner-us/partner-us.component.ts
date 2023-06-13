import { CompanyServiceService } from './../services/company-service.service';
import { ICompany } from 'src/models/company';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Stepper from 'bs-stepper';
import { DaysSlot } from '../constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IOwner } from 'src/models/owner';
import { ICompanyDto } from 'src/models/companyDto';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-partner-us',
  templateUrl: './partner-us.component.html',
  styleUrls: ['./partner-us.component.scss'],
})
export class PartnerUsComponent implements OnInit {
  private stepper?: Stepper;
  days = DaysSlot;
  // updatedDays = DaysSlot;
  modalRef!: BsModalRef;
  partnerWithUsForm!: FormGroup;
  serviceOfferForm!: FormGroup;
  manageHoursForm!: FormGroup;
  requestForm!: FormGroup;
  companyModel!: ICompany;
  servicesList: any = []
  reqObj: any
  company!: ICompany;

  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;

  zoom = 12;
  maxZoom = 15;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    maxZoom: this.maxZoom,
    minZoom: this.minZoom,
  }
  markers = [] as any;
  infoContent = ''

  locationValue = {
    lat: 0,
    long: 0
  }

  constructor(private modalService: BsModalService,
    public fb: FormBuilder,
    public _companyService: CompanyServiceService,
    private router: Router,
    private toastr: ToastrService,
    private _loginService: LoginService) { }


  ngOnInit() {
    const el = document.querySelector('#stepper1');
    if (el) {
      this.stepper = new Stepper(el, {
        linear: false,
        animation: true,
      });
    }
    this.createForm();
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })
    console.log(this.partnerWithUsForm);
    console.log(this.servicesList);
  }

  createForm() {
    this.partnerWithUsForm = this.fb.group({
      name: ['', Validators.required],
      //lname: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      businessName: ['', Validators.required],
      password: ['', Validators.required],
    })

    this.serviceOfferForm = this.fb.group({
      serviceName: ['', Validators.required],
      price: ['', Validators.required],
      estimatedTime: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  next(): any {
    this.stepper?.next();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  checkAvailable(evnt: any, index: any) {
    this.days[index]['isAvailable'] = evnt.currentTarget.checked
  }

  saveData() {
    this.reqObj = {
      useObj: this.partnerWithUsForm.value,
      serviceObj: this.servicesList,
      workingHoursObj: this.days,
      locationObj: this.locationValue
    }

    this._companyService.createCompany(this.reqObj)
      .subscribe({
        next: (v) => {
          if (v) {
            //this.company = v;
            //console.log(v);
            console.log(v.company.owner.ownerId);

            //console.log(v.owner);

            localStorage.setItem("id", v.company.owner.ownerId);
            localStorage.setItem("role", "Partner");
            localStorage.setItem("name", v.company.owner.name);
            this._loginService.setPartner(true);
            this._companyService.setCompany(this.company)
            this.router.navigate(['/partner'])
          }
        },
        error: (e) => {
          console.error(e);
          this.toastr.error(e.message, "Error");
        },
        complete: () => {
          this.reqObj = {}
        }
      });

    return false;
  }

  addService(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  cancel() {
    this.modalRef.hide();
    this.serviceOfferForm.reset()
  }

  changeTime(type: string, index: any, event: any) {
    console.log(event.target.value)
    console.log(this.days)
    if (type === 'isFrom') {
      this.days[index].from = event.target.value;
    } else {
      this.days[index].to = event.target.value;
    }
  }

  saveService() {
    console.log(this.serviceOfferForm?.value)
    this.servicesList.push(this.serviceOfferForm.value)
    this.serviceOfferForm.reset()
    this.modalRef.hide();
  }


  ////////////////////////////for maps//////////////////////////
  zoomIn() {
    if (this.zoom < this.maxZoom) this.zoom++;
    console.log('Get Zoom', this.map.getZoom());
  }

  zoomOut() {
    if (this.zoom > this.minZoom) this.zoom--;
  }

  eventHandler(event: any, name: string) {
    console.log(event, name);

    // Add marker on double click event
    if (name === 'mapDblclick') {
      this.dropMarker(event)
    }
  }

  // Markers
  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()))
  }

  dropMarker(event: any) {
    if (this.markers.length < 1) {
      this.markers.push({
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
        // label: {
        //   color: 'blue',
        //   text: 'Marker label ' + (this.markers.length + 1),
        // },
        title: 'Marker title ' + (this.markers.length + 1),
        info: 'Marker info ' + (this.markers.length + 1),
        options: {
          animation: google.maps.Animation.DROP,
        },
      })

      this.addMarkerToObj(event.latLng.lat(), event.latLng.lng())
    }
    else {
      this.toastr.warning("Marker already added", "Warning");
    }
  }

  addMarkerToObj(lat: number, long: number) {
    this.locationValue.lat = lat;
    this.locationValue.long = long;
  }

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }

  removeMarker() {
    if (this.markers.length > 0) {
      this.markers.pop()
    }
    else {
      this.toastr.warning("No Marker added", "Warning");
    }

  }

}
