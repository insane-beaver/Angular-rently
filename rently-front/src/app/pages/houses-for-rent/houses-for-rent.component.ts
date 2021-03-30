import { Component, OnInit } from '@angular/core';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Inf} from '../../classes/Inf';
import {House} from '../../classes/house';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-houses-for-rent',
  templateUrl: './houses-for-rent.component.html',
  styleUrls: ['./houses-for-rent.component.sass']
})
export class HousesForRentComponent implements OnInit {

  constructor(private database: DatabaseProviderService) { }

  houses!: Array<House>;
  sortType: number = 0;
  text!: string;

  category!: number;
  minPrice!: number;
  maxPrice!: number;

  rooms_1: boolean = false;
  rooms_2: boolean = false;
  rooms_3: boolean = false;
  rooms_4: boolean = false;
  rooms_5: boolean = false;

  bathrooms_1: boolean = false;
  bathrooms_2: boolean = false;
  bathrooms_3: boolean = false;
  bathrooms_4: boolean = false;
  bathrooms_5: boolean = false;

  ngOnInit(): void {
    this.database.getHousesPromise().then(value => {
      Inf.houses == value;
      this.houses = new Array<House>();

      if((Inf.searchCity!=undefined) && (Inf.searchCity !='0')) {
        Inf.houses.forEach(value => {
          if(value.city== Inf.searchCity)
            this.houses.push(value);3
        });
        this.text = "Flats and houses in " + Inf.searchCity;
      }
      else
        this.houses = Inf.houses;
    });
  }

  isDesktop() {
    return Inf.isDesktop;
  }
  getCategory(category: number) {
    if(category==1)
      return "Flat"
    else
      return "House"
  }

  Sort(form: NgForm): void {
    this.sortType = form.value.sortType;
    if(this.sortType==0) {
      this.houses = Inf.houses;
    }
    else if(this.sortType==1) {
      this.houses.sort((a,b) => (a.price > b.price) ? -1 : ((b.price > a.price) ? 1 : 0));
    }
    else if(this.sortType==2) {
      this.houses.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
    }
  }

  OnlyHouses() {
    this.houses.forEach(value => {
      if(value.category!=2)
        this.houses.splice(this.houses.indexOf(value),1);
    })
  }
  OnlyFlats() {
    this.houses.forEach(value => {
      if(value.category!=1)
        this.houses.splice(this.houses.indexOf(value),1);
    })
  }

  Filter(form: NgForm): void {
    this.minPrice=form.value.minPrice;
    this.maxPrice=form.value.maxPrice;

    this.rooms_1 = form.value.rooms_1;
    this.rooms_2 = form.value.rooms_2;
    this.rooms_3 = form.value.rooms_3;
    this.rooms_4 = form.value.rooms_4;
    this.rooms_5 = form.value.rooms_5;

    this.bathrooms_1 = form.value.bathrooms_1;
    this.bathrooms_2 = form.value.bathrooms_2;
    this.bathrooms_3 = form.value.bathrooms_3;
    this.bathrooms_4 = form.value.bathrooms_4;
    this.bathrooms_5 = form.value.bathrooms_5;

    this.houses = new Array<House>();
    this.houses = this.get_Array_After_Price(Inf.houses);
    this.houses = this.get_Array_After_Rooms(this.houses);
    this.houses = this.get_Array_After_Bathrooms(this.houses);
  }

  get_Array_After_Price(array: Array<House>) {
    let arr: Array<House> = new Array<House>();
    array.forEach(value => {
      if(this.minPrice!=undefined && this.maxPrice!=undefined) {
        if((value.price>=this.minPrice) && (value.price<=this.maxPrice)) {
          arr.push(value);
        }
      }
      else
        arr.push(value);
    });
    return arr;
  }
  get_Array_After_Rooms(array: Array<House>) {
    let arr: Array<House> = new Array<House>();
    array.forEach(value => {
      if(this.rooms_1 && value.roomsNumber==1)
        arr.push(value);
      else if(this.rooms_2 && value.roomsNumber==2)
        arr.push(value);
      else if(this.rooms_3 && value.roomsNumber==3)
        arr.push(value);
      else if(this.rooms_4 && value.roomsNumber==4)
        arr.push(value);
      else if(this.rooms_5 && value.roomsNumber>=5)
        arr.push(value);
      else if(!this.rooms_1 && !this.rooms_2 && !this.rooms_3 && !this.rooms_4 && !this.rooms_5)
        arr.push(value);
    });
    return arr;
  }
  get_Array_After_Bathrooms(array: Array<House>) {
    let arr: Array<House> = new Array<House>();
    array.forEach(value => {
      if(this.bathrooms_1 && value.bathroomsNumber==1)
        arr.push(value);
      else if(this.bathrooms_2 && value.bathroomsNumber==2)
        arr.push(value);
      else if(this.bathrooms_3 && value.bathroomsNumber==3)
        arr.push(value);
      else if(this.bathrooms_4 && value.bathroomsNumber==4)
        arr.push(value);
      else if(this.bathrooms_5 && value.bathroomsNumber>=5)
        arr.push(value);
      else if(!this.bathrooms_1 && !this.bathrooms_2 && !this.bathrooms_3 && !this.bathrooms_4 && !this.bathrooms_5)
        arr.push(value);
    });
    return arr;
  }

  Cancel() {
    this.houses = new Array<House>();
    this.houses = Inf.houses;

    this.rooms_1 = false;
    this.rooms_2 = false;
    this.rooms_3 = false;
    this.rooms_4 = false;
    this.rooms_5 = false;

    this.bathrooms_1 = false;
    this.bathrooms_2 = false;
    this.bathrooms_3 = false;
    this.bathrooms_4 = false;
    this.bathrooms_5 = false;
  }



}
