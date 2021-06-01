import {AfterViewInit, Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {House} from '../../classes/house';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Person} from '../../classes/person';
import {Inf} from '../../classes/Inf';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {Payment} from '../../classes/payment';
import jsPDF from 'jspdf';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-house-details',
  templateUrl: './house-details.component.html',
  styleUrls: ['./house-details.component.sass']
})
export class HouseDetailsComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private database: DatabaseProviderService) { }

  house: House = new House();
  payment: Payment = new Payment();
  owner: Person = new Person();
  months: number = 1;
  totalNoTax!: number;
  totalTax!: number;
  slideIndex = 0;

  startMonth!: string;
  endMonth!: string;
  start!: any;
  end!: any;

  //dates system
  buttonText: string = "Check";
  inProcess: boolean = false;
  errorAlert: boolean = false;
  validDates: boolean = false;
  unavailableDates: any = new Array<String>();
  //end

  ngOnInit() {
    /*let today = new Date();
    this.startMonth = today.getMonth()+'.'+today.getFullYear();
    this.endMonth = this.startMonth;*/

    this.database.getHousesPromise().then(value => {
      this.route.params.subscribe((params: Params) => {
        this.house = new House();
        if(params.id) {
          this.house = this.database.getHouse(params.id);
          setTimeout(() => this.plusSlides(1), 500);

          this.database.getOwner(this.house.ownerId).then(value => {
            this.owner = value;
          });
          this.totalNoTax = this.house.price * this.months;
          this.totalTax = this.totalNoTax + this.totalNoTax * 0.01;
          this.initPayPalConfig();
          this.initGooglePayConfig();
        }
      });
    });
  }

  plusSlides(n:number) {
    this.showSlides(this.slideIndex += n);
  }

  showSlides(n:number) {
    let i;
    let x:any = document.getElementsByClassName("mySlides");
    if(n > x.length)
      this.slideIndex = 1
    if(n < 1)
      this.slideIndex = x.length
    for (i = 0; i < x.length; i++)
      x[i].style.display = "none";
    x[this.slideIndex-1].style.display = "block";
  }

  getHouseCategory() {
    let string!: string;

    if(this.house.category == 1)
      string = "Flat"
    else if(this.house.category ==2)
      string = "House"
    if(this.house.id != undefined)
      string = string + " in " + this.house.city;

    return string
  }
  getCt() {
    if(this.house.category == 1)
      return "Flat"
    else
      return "House"
  }
  getPreparedSize() {
    if(Inf.isDesktop)
      return "max-width: 96%; height: 60vh;"
    else
      return "max-width: 100%; height: 30vh;"
  }
  getButtonSize() {
    if(Inf.isDesktop)
      return "max-width: 27vw"
    else
      return "max-width: 100vw"
  }

  CheckPeriod(form: NgForm):void {
    this.buttonText = "Checking...";
    this.inProcess = true;

    this.startMonth = form.value.start_month;
    this.endMonth = form.value.end_month;
    this.start = this.startMonth.split('-');
    this.end = this.endMonth.split('-');

    this.payment.startYear = +(this.start[0]);
    this.payment.startMonth = +(this.start[1]);
    this.payment.endYear = +(this.end[0]);
    this.payment.endMonth = +(this.end[1]);

    let length = 0;
    let wrongDate = false;
    if(this.start[0] <= this.end[0]) {
      length = this.end[1] - this.start[1] + (this.end[0] - this.start[0])*12 + 1;
    }
    if(length>=1) {
      this.months = length;

      this.database.getPaymentsFor(this.house.id).then(value => {
        this.unavailableDates = new Array<String>();
        value.forEach(item => {
          for(let i = this.payment.startYear; i<=this.payment.endYear; ++i) {
            for(let ii=item.startYear; ii<=item.endYear; ++ii) {
              if(i==ii) {
                for(let j = this.payment.startMonth; j<=this.payment.endMonth; ++j) {
                  for(let jj = item.startMonth; jj<=item.endMonth; ++jj) {
                    if(j==jj) {
                      wrongDate = true;
                      this.unavailableDates.push(j+"."+i);
                    }
                  }
                }
              }
            }
          }
        })
      });
    }
    else {
      wrongDate = true;
    }

    setTimeout(() => {
      this.buttonText = "Check";
      this.inProcess = false;
      this.errorAlert = false;

      if(wrongDate) {
        this.errorAlert = true;
        this.validDates = false;
        form.reset();
      }
      else {
        this.validDates = true;
        this.countTotal();
      }
    }, 1500);
  }

  countTotal() {
    this.totalNoTax = this.house.price * this.months;
    this.totalTax = this.totalNoTax + this.totalNoTax * 0.01;
  }

  /*GOOGLE PAY*/
  googlePayConfig!: google.payments.api.PaymentDataRequest;
  private initGooglePayConfig(): void {
    this.googlePayConfig = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['VISA', 'MASTERCARD']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'allpayments',
            gatewayMerchantId: 'exampleGatewayMerchantId'
          }
        }
      }],
      merchantInfo: {
        merchantId: 'BCR2DN6TV7BM3M3V',
        merchantName: 'Rently'
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: this.totalTax.toString(),
        currencyCode: 'USD',
        countryCode: 'US'
      }
    }
  }
  onLoadPaymentData(event: any) {
    console.log("load payment data", event.detail);
    this.savePayment();
  }
  /*---END---*/

  /*PayPal*/
  payPalConfig ? : IPayPalConfig;
  showSuccess: boolean = false;
  private initPayPalConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.totalTax.toString(),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.totalTax.toString()
                }
              }
            },
            items: [
              {
                name: 'Months of rent',
                quantity: this.months.toString(),
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: this.house.price.toString(),
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
        this.savePayment();
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
  /*---END---*/

  savePayment() {
    this.payment.id = 'r'+Date.now().toString();

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    this.payment.date = dd + '.' + mm + '.' + yyyy + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    this.payment.house = this.house;

    this.payment.startYear = +(this.start[0]);
    this.payment.startMonth = +(this.start[1]);
    this.payment.endYear = +(this.end[0]);
    this.payment.endMonth = +(this.end[1]);

    this.payment.renterId = Inf.person.id;
    this.payment.totalPrice = this.totalTax

    setTimeout(() => this.printReceipt(), 100);
    this.database.savePayment(this.payment);
  }
  printReceipt() {
    const data = document.getElementById('Receipt') as HTMLElement;
    const doc: jsPDF = new jsPDF("p", "px", "b4");
    doc.html(data, {
      callback: (doc) => {
        doc.save("rently.studio - " + this.payment.date + ".pdf");
      }
    });
  }

}
