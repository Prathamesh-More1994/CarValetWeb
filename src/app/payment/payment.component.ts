

import { Component, HostBinding, Input, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Appearance, ConfirmPaymentData, loadStripe } from "@stripe/stripe-js";
import { IResponse } from "src/models/response";
import { IService } from "src/models/service";
import { ICompany } from "src/models/company";
import { IUser } from "src/models/user";
import { PaymentService } from "../services/payment.service";
import { IPayment } from "src/models/payment";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../services/user.service";


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Input() service!: IService;
  @Input() company!: ICompany;
  @Input() user!: IUser;
  isLoading: boolean = false;
  stripe: any;
  key!: string;
  @HostBinding('class.hidden') someField: boolean = false;

  element: any;
  ngOnInit(): void {
    this.getList();
    this.init();
  }
  constructor(http: HttpClient,
    private _paymentService: PaymentService,
    private toastr: ToastrService,
    private _userService: UserService,
    private router: Router) {
    this.http = http;
  }

  getList() {
    this.http
      .get("https://localhost:7164/Payment")
      .subscribe({
        next: (v) => {
          console.log(v);

        }
      })
  }

  async init() {
    let body = {
      //tokenId: token.id,
      productName: this.service.name,
      amount: this.service.price,
      customer: this.user.name
    };
    let bodyString = JSON.stringify(body);
    this.stripe = await loadStripe('pk_test_51L3qbKLEKLTwHLbQKbot9q1wb7f4wuCLaClXNId5yV1KEHwQ4hOfZsEr33w6qS4H6kIxGI44CpqZjP6Kzptw4vnP00dP12pUQa');

    this._paymentService.pay(bodyString)
      .subscribe
      ({
        next: (res: IResponse) => {

          var response = res.clientSecret;
          this.key = response
          const clientSecret = response;
          const appearance: Appearance = {
            theme: 'stripe'
          };
          this.element = this.stripe?.elements({ clientSecret, appearance })


          const paymentElement = this.element.create("payment");
          paymentElement.mount("#payment-element");


        },
        error: (error) => {

        }
      })

  }

  async Submit(e: any) {
    //console.log(e);

    e.preventDefault();
    this.setLoading(true);
    var elements = this.element
    var confirmParams: Partial<ConfirmPaymentData> | undefined = {
      return_url: "",
    }
    var error: any;
    //const stripe = await loadStripe('pk_test_51L3qbKLEKLTwHLbQKbot9q1wb7f4wuCLaClXNId5yV1KEHwQ4hOfZsEr33w6qS4H6kIxGI44CpqZjP6Kzptw4vnP00dP12pUQa');
    await this.stripe?.confirmPayment({
      elements,
      confirmParams,
      redirect: "if_required"
    }).then((result: any) => {
      console.log(result);

      if (result.paymentIntent) {
        this._paymentService.saveData(result)
        this.pushData()
        this.showMessage(result.paymentIntent.status);
      }

      if (result.error) {
        console.log(result.error);
        error = result.error
        console.error(result.error);
        if (error?.type === "card_error" || error?.type === "validation_error") {
          this.showMessage(error?.message);
        } else {
          this.showMessage("An unexpected error occured.");
        }
      }
    });;

    this.setLoading(false);

  }

  showMessage(messageText: any) {
    console.log(messageText);

    const messageContainer = document.querySelector("#payment-message");

    messageContainer?.classList.remove("hidden");
    messageContainer!.textContent = messageText;

    setTimeout(function () {
      messageContainer?.classList.add("hidden");
      messageText!.textContent = "";
    }, 2000);
  }

  setLoading(isLoading: boolean) {
    if (isLoading) {
      // Disable the button and show a spinner
      this.isLoading = isLoading
      //document.querySelector("#submit").disabled = true;

      document.querySelector("#spinner")?.classList.remove("hidden");
      document.querySelector("#button-text")?.classList.add("hidden");
    } else {
      this.isLoading = isLoading
      document.querySelector("#spinner")?.classList.add("hidden");
      document.querySelector("#button-text")?.classList.remove("hidden");
    }
  }

  http: HttpClient;

  takePaymentResult!: string;

  pushData() {
    var paymentData: IPayment = {
      amount: this.service.price,
      clientSecretKey: this.key,
      companyId: this.company.companyId,
      userId: this.user.userId,
      productName: this.service.name,
      metadata: [{
        key: "testkey",
        value: "testValue"
      }],
      createdDate: new Date()
    }

    this._paymentService.addPayment(paymentData)
      .subscribe({
        next: (v) => {
          this._userService.updateUser(this.user)
            .subscribe({
              next: (x) => {
                this.toastr.success("Payment successfull", "Payment")
                this.router.navigate(['/appointment'])
              },
              error: (e) => console.error(e),
              complete: () => console.info('complete')
            })
        }
      })
  }


}


