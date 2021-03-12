import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {House} from '../../classes/house';
import {DatabaseProviderService} from '../../services/database-provider.service';
import {Person} from '../../classes/person';
import {Inf} from '../../classes/Inf';

@Component({
  selector: 'app-house-details',
  templateUrl: './house-details.component.html',
  styleUrls: ['./house-details.component.sass']
})
export class HouseDetailsComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private route: ActivatedRoute, private database: DatabaseProviderService) { }

  house: House = new House();
  owner: Person = new Person();
  slideIndex = 0;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.house = new House();
      if(params.id) {
        this.house = this.database.getHouse(params.id);
        this.database.getOwner(this.house.ownerId).then(value => {
          this.owner = value;
        })
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  ngAfterViewInit() {
    this.plusSlides(1);
  }

  plusSlides(n:number) {
    this.showSlides(this.slideIndex += n);
  }

  showSlides(n:number) {
    let i;
    let x:any = document.getElementsByClassName("mySlides");
    if(n > x.length)
      this.slideIndex = 1
    if(n < 1)
      this.slideIndex = x.length
    for (i = 0; i < x.length; i++)
      x[i].style.display = "none";
    x[this.slideIndex-1].style.display = "block";
  }

  getHouseCategory() {
    let string: string = "Error of loading page, please go back to the main page";

    if(this.house.category == 1)
      string = "Flat"
    else if(this.house.category ==2)
      string = "House"
    if(this.house.id != undefined)
      string = string + " in " + this.house.city;

    return string
  }
  getCt() {
    if(this.house.category == 1)
      return "Flat"
    else
      return "House"
  }
  getMargin() {
    if(Inf.isDesktop)
      return "margin-left: -20%"
    else
      return ""
  }
  getPreparedSize() {
    if(Inf.isDesktop)
      return "max-width: 110vh; max-height: 60vh;"
    else
      return "max-width: 99%; max-height: 30vh;"
  }

}
