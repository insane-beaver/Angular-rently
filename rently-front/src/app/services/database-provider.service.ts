import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable, Subscription} from "rxjs";
import { Person } from '../classes/person';
import { Inf } from '../classes/Inf';
import { LocalStorageService } from './local-storage.service';
import {House} from '../classes/house';

@Injectable({
  providedIn: 'root'
})
export class DatabaseProviderService {
  person_collection: string = "persons";
  houses_collection: string = "houses";


  //person
  personsColRe!: AngularFirestoreCollection<Person>;
  persons: Observable<Person[]> = new Observable<Person[]>();
  person_subscription!: Subscription;

  //house
  houseColRe!: AngularFirestoreCollection<House>;
  houses: Observable<House[]> = new Observable<House[]>();
  house_subscription!: Subscription;


  constructor(private store: AngularFirestore, private storage: LocalStorageService) {
    this.personsColRe = this.store.collection(this.person_collection);
    this.persons = this.personsColRe.valueChanges();

    this.houseColRe = this.store.collection(this.houses_collection);
    this.houses = this.houseColRe.valueChanges();
  }

  private removeDuplicates(data: Array<String>) {
    return data.filter((value, index) => data.indexOf(value) === index);
  }


  //person
  public savePerson() {
    this.store.collection(this.person_collection).doc(Inf.person.id).set(Object.assign({}, Inf.person));
  }
  public changePerson() {
    this.store.collection(this.person_collection).doc(Inf.person.id).update(Object.assign({}, Inf.person));
  }
  public getPerson() {
    let was:boolean = false;
    this.person_subscription = this.persons.subscribe(value => {
      if(!was) {
        was = true;

        for (let i in value) {
          if(value[i].id == Inf.person.id) {
            Inf.person = value[i] as Person;
            this.storage.saveInf();
            console.log(Inf.person);
          }
        }
      }
    })
  }
  public async getOwner(id:string): Promise<Person> {
    return new Promise<Person>((resolve) => {
      let owner: Person = new Person();
      let was:boolean = false;
      this.person_subscription = this.persons.subscribe(value => {
        if(!was) {
          was = true;

          for (let i in value) {
            if(value[i].id == id)
              owner = value[i];
          }
          resolve(owner);
        }
      });
    })
  }

  //house
  public saveHouse(house: House) {
    this.store.collection(this.houses_collection).doc(house.id+'').set(Object.assign({}, house));
  }
  public changeHouse(house: House) {
    this.store.collection(this.houses_collection).doc(house.id+'').update(Object.assign({}, house));
  }
  public deleteHouse(id: string) {
    this.store.collection(this.houses_collection).doc(id).delete();
  }
  public getHouses() {
    Inf.houses = new Array<House>();
    let was:boolean = false;
    this.house_subscription = this.houses.subscribe(value => {
      if(!was) {
        was = true;

        for (let i in value) {
          Inf.houses.push((value[i] as House));
        }
      }
    })
  }
  public async getHousesPromise(): Promise<House[]> {
    return new Promise<House[]>((resolve) => {
      Inf.houses = new Array<House>();
      let was:boolean = false;
      this.house_subscription = this.houses.subscribe(value => {
        if(!was) {
          was = true;

          for (let i in value) {
            Inf.houses.push((value[i] as House));
          }
          resolve(Inf.houses);
        }
      });
    })
  }
  public getHousesForOwner() {
    Inf.houses = new Array<House>();
    let was:boolean = false;
    this.house_subscription = this.houses.subscribe(value => {
      if(!was) {
        was = true;

        for (let i in value) {
          if(value[i].ownerId == Inf.person.id)
            Inf.houses.push((value[i] as House));
        }
      }
    })
  }
  public getHouse(id: string) {
    let house: House = new House();
    for(let item of Inf.houses) {
      if(item.id==id)
        house=item;
    }
    return house;
  }
  public async getCities(): Promise<String[]> {
    return new Promise<String[]>((resolve) => {
      Inf.houses = new Array<House>();
      let cities = new Array<String>();
      let was:boolean = false;
      this.house_subscription = this.houses.subscribe(value => {
        if(!was) {
          was = true;

          for (let i in value) {
            Inf.houses.push((value[i] as House));
            cities.push(value[i].city);
          }

          cities = this.removeDuplicates(cities);
          cities.sort();
          resolve(cities);
        }
      });
    })
  }

}
