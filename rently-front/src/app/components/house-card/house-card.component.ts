import {Component, Input, OnInit, Output} from '@angular/core';
import {Inf} from '../../classes/Inf';
import {Router} from '@angular/router';

@Component({
  selector: 'app-house-card',
  templateUrl: './house-card.component.html',
  styleUrls: ['./house-card.component.sass']
})
export class HouseCardComponent implements OnInit {

  @Input('id')id!: string;
  @Input('image')image!: String;
  @Input('category')category!: string;
  @Input('country')country!: string;
  @Input('city')city!: string;
  @Input('roomsNumber')roomsNumber!: number;
  @Input('bathroomsNumber')bathroomsNumber!:number;
  @Input('price')price!: number;
  @Input('description')description!: string;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  isDesktop() {
    return Inf.isDesktop;
  }


}
