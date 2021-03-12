import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Inf} from '../../classes/Inf';
import {NgForm, NgModel} from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {

  cities= new Array<String>();
  selectedCity: string = '0';
  selectedCity1: string = '0';

  constructor(private router: Router, private database: DatabaseProviderService) { }

  ngOnInit(): void {
    this.database.getCities().then(value => {
      this.cities = value;
    })
  }
  searchHouse(form: NgForm): void {
    Inf.searchCity = form.value.city;
    this.router.navigateByUrl('houses-for-rent');
  }
  searchHouseMobile(form: NgForm): void {
    Inf.searchCity = form.value.city1;
    this.router.navigateByUrl('houses-for-rent');
  }
  isDesktop() {
    return Inf.isDesktop;
  }
  getWidth() {
    let string: string = "max-width: " + (screen.width-10) + "px;"
     return string;
  }

}
