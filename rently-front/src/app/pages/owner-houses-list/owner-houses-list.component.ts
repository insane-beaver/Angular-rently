import { Component, OnInit } from '@angular/core';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Inf} from '../../classes/Inf';
import {Router} from '@angular/router';

@Component({
  selector: 'app-owner-houses-list',
  templateUrl: './owner-houses-list.component.html',
  styleUrls: ['./owner-houses-list.component.sass']
})
export class OwnerHousesListComponent implements OnInit {

  constructor(private database: DatabaseProviderService, private router: Router) { }

  ngOnInit(): void {
    if (!Inf.person.isOwner) {
      this.router.navigateByUrl('/');
    }

    this.database.getHousesForOwner();
  }
  getHouses() {
    return Inf.houses;
  }
  deleteAdvert(id: string) {
    this.database.deleteHouse(id);
    this.database.getHousesForOwner();
  }

}
