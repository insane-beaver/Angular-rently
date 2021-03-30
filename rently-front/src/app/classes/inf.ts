import {Person} from './person';
import {House} from './house';

export class Inf {
  public static isLoged: boolean = false;
  public static person: Person;
  public static houses: House[] = new Array<House>();
  public static isDesktop: boolean;
  public static searchCity: string;
}
