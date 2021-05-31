import {House} from './house';

export class Payment {
  id!: string;
  date!: string;
  house: House = new House();
  startMonth!: number;
  startYear!: number;
  endMonth!: number;
  endYear!: number;
  renterId!: string;
  totalPrice!: number;
}
