import {Component, OnInit} from '@angular/core';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Inf} from '../../classes/Inf';
import {Payment} from '../../classes/payment';

@Component({
  selector: 'app-rents-list',
  templateUrl: './rents-list.component.html',
  styleUrls: ['./rents-list.component.sass']
})
export class RentsListComponent implements OnInit {

  constructor(private database: DatabaseProviderService) {
  }

  payments!: Array<Payment>;

  ngOnInit(): void {
    this.database.getPaymentsForUser(Inf.person.id).then(value => {
      this.payments = value;
      console.log(this.payments);
    });
  }

  getCategory(category: number) {
    if (category == 1) {
      return 'Flat';
    } else {
      return "House";
    }
  }

}
