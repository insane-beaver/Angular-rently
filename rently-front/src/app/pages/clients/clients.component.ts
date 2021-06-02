import { Component, OnInit } from '@angular/core';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Payment} from '../../classes/payment';
import {Inf} from '../../classes/Inf';
import {PaymentOut} from '../../classes/payment-out';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.sass']
})
export class ClientsComponent implements OnInit {

  constructor(public database: DatabaseProviderService) { }

  payments: Array<PaymentOut> = new Array<PaymentOut>();

  ngOnInit(): void {
    this.database.getPayments().then(value => {
      value.forEach(item => {
        if(item.house.ownerId == Inf.person.id) {
          let paymentOut: PaymentOut = new PaymentOut();
          paymentOut.payment = item;
          this.database.getOwner(item.renterId).then(value1 => {
            paymentOut.renterInfo =value1;
            this.payments.push(paymentOut);
          });
        }
      })
    });
  }

  getCategory(category: number) {
    if(category ==1)
      return "Flat";
    else
      return "House";
  }

}
