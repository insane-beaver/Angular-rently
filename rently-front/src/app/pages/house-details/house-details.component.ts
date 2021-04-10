import {AfterViewInit, Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {House} from '../../classes/house';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Person} from '../../classes/person';
import {Inf} from '../../classes/Inf';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {isEmpty} from 'rxjs/operators';

@Component({
  selector: 'app-house-details',
  templateUrl: './house-details.component.html',
  styleUrls: ['./house-details.component.sass']
})
export class HouseDetailsComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private database: DatabaseProviderService) { }

  house: House = new House();
  owner: Person = new Person();
  months: number = 1;
  total!: number;
  slideIndex = 0;

  ngOnInit() {
    this.database.getHousesPromise().then(value => {
      this.route.params.subscribe((params: Params) => {
        this.house = new House();
        if(params.id) {
          this.house = this.database.getHouse(params.id);
          setTimeout(() => this.plusSlides(1), 500);

          this.database.getOwner(this.house.ownerId).then(value => {
            this.owner = value;
          });
          this.total = this.house.price * this.months;
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
  getMargin() {
    if(Inf.isDesktop)
      return "margin-left: -20%"
    else
      return ""
  }
  getPreparedSize() {
    if(Inf.isDesktop)
      return "max-width: 110vh; max-height: 60vh;"
    else
      return "max-width: 99%; max-height: 30vh;"
  }

  countTotal() {
    this.total = this.house.price * this.months;
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
        totalPrice: this.total.toString(),
        currencyCode: 'USD',
        countryCode: 'US'
      }
    }
  }
  onLoadPaymentData(event: any) {
    console.log("load payment data", event.detail);
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
              value: this.total.toString(),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.total.toString()
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

}
