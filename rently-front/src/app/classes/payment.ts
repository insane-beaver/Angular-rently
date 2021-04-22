import {House} from './house';

export class Payment {
  id!: string;
  date!: string;
  house: House = new House();
  months!: number;
  renterId!: string;
}
