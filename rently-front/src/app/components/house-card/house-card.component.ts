import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-house-card',
  templateUrl: './house-card.component.html',
  styleUrls: ['./house-card.component.sass']
})
export class HouseCardComponent implements OnInit {

  @Input('image')image!: string;


  constructor() { }

  ngOnInit(): void {
  }

}
