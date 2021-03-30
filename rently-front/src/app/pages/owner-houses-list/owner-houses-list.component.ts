import { Component, OnInit } from '@angular/core';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Inf} from '../../classes/Inf';

@Component({
  selector: 'app-owner-houses-list',
  templateUrl: './owner-houses-list.component.html',
  styleUrls: ['./owner-houses-list.component.sass']
})
export class OwnerHousesListComponent implements OnInit {

  constructor(private database: DatabaseProviderService) { }

  ngOnInit(): void {
    this.database.getHousesForOwner();
  }
  getHouses() {
    return Inf.houses;
  }
  getCategory(category: number) {
    if(category==1)
      return "Flat"
    else
      return "House"
  }

  deleteAdvert(id: string) {
    this.database.deleteHouse(id);
    this.database.getHousesForOwner();
  }

}
