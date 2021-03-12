export class House {
  id!: string;
  ownerId!: string;
  category: number=0; //1-flat 2-house
  price!: number;
  country!: string;
  city!: string;
  postalCode!: string;
  roomsNumber!: number;
  bathroomsNumber!: number;
  photos: String[] = new Array<String>();
  description: string = "";
}
