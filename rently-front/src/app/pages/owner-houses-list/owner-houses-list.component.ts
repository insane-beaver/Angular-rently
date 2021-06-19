import { Component, OnInit } from '@angular/core';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Inf} from '../../classes/Inf';
import {Router} from '@angular/router';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-owner-houses-list',
  templateUrl: './owner-houses-list.component.html',
  styleUrls: ['./owner-houses-list.component.sass']
})
export class OwnerHousesListComponent implements OnInit {

  constructor(private database: DatabaseProviderService, private router: Router) { }

  doughnutChartLabels: Label[] = ['1','2','3','4','5','6','7','8','9','10'];
  doughnutChartData: MultiDataSet = [
    [10,10,10,10,10,10,10,10,10,10]
  ];
  doughnutChartType: ChartType = 'doughnut';

  ngOnInit(): void {
    if (!Inf.person.isOwner) {
      this.router.navigateByUrl('/');
    }

    this.database.getHousesForOwnerPromise().then(value => {
      Inf.houses = value;
      let incomesNumb = new Array<number>();
      let houses = new Array<string>();
      let i=0;

      Inf.houses.forEach(house => {
        houses.push(house.city + " - "+ house.addressLine1);
        this.database.getPaymentsFor(house.id).then(payments => {
          let income =0;
          payments.forEach(payment => {
            income+=payment.totalPrice;
          });
          i++;
          incomesNumb.push(income);

          if(i==value.length) {
            let allIncome =0;
            incomesNumb.forEach(value1 => {
              allIncome+=value1;
            });
            let incomes = new Array<number>();
            incomesNumb.forEach(value1 => {
              incomes.push(Math.round(value1 / allIncome * 100));
            });
            this.doughnutChartLabels = houses;
            this.doughnutChartData = [incomes];
          }

        });
      });
    });
  }
  getHouses() {
    return Inf.houses;
  }
  deleteAdvert(id: string) {
    this.database.deleteHouse(id);
    this.database.getHousesForOwner();
  }

}
