import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Person} from '../../classes/person';
import {House} from '../../classes/house';
import {Inf} from '../../classes/Inf';
import {Payment} from '../../classes/payment';

@Component({
  selector: 'app-owner-details',
  templateUrl: './owner-details.component.html',
  styleUrls: ['./owner-details.component.sass']
})
export class OwnerDetailsComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private database: DatabaseProviderService) {
  }

  owner: Person = new Person();
  houses: Array<House> = new Array<House>();
  payments: Array<Payment> = new Array<Payment>();

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.database.getOwner(params.id).then(value => {
          this.owner = value;
          this.database.getHousesPromise().then(value1 => {
            value1.forEach(item => {
              if (item.ownerId == this.owner.id) {
                this.houses.push(item);
              }
            });
          });
          this.database.getPayments().then(value1 => {
            value1.forEach(item => {
              if (item.house.ownerId == this.owner.id) {
                this.payments.push(item);
              }
            });
          });
        });
      }
    });
  }

  isDesktop() {
    return Inf.isDesktop;
  }

  getCategory(category: number) {
    if (category == 1) {
      return 'Flat';
    } else {
      return 'House';
    }
  }

  call(): void {
    window.open('tel:' + this.owner.mobileNumber);
  }

  write(): void {
    window.open("mailto:" + this.owner.email);
  }

}
