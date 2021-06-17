export class House {
  id!: string;
  ownerId!: string;
  category: number=0; //1-flat 2-house
  price!: number;
  country!: string;
  city!: string;
  addressLine1!: string;
  addressLine2: string = "";
  postalCode!: string;
  roomsNumber!: number;
  bathroomsNumber!: number;
  photos: String[] = new Array<String>();
  description: string = "";
  verified: boolean = false;
}
