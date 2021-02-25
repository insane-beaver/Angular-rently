import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  searchHouse(): void {

    this.router.navigateByUrl('houses-for-rent');
  }

}
