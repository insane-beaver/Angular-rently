import {Inject, Injectable} from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {Inf} from '../classes/Inf';
import {Person} from '../classes/person';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public saveInf(): void {
    let isLoged = Inf.isLoged;
    let person: Person = Inf.person;
    this.storage.set('Inf_isLoged', isLoged);
    this.storage.set('Inf_person', person);
    this.storage.set('Inf_language', Inf.language);
  }

  public getInf(): void {
    Inf.isLoged = this.storage.get('Inf_isLoged');
    if(Inf.isLoged == undefined)
      Inf.isLoged = false;
    Inf.person = this.storage.get('Inf_person');
    if(Inf.person == undefined)
      Inf.person = new Person();
    Inf.language = this.storage.get('Inf_language');
    if(Inf.language == undefined)
      Inf.language = "en";
  }
}
