import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import {NgForm} from '@angular/forms';
import {Person} from '../../classes/person';
import { LocalStorageService } from '../../services/local-storage.service';
import { Inf } from '../../classes/Inf';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.sass']
})
export class MainLayoutComponent implements OnInit {
  isOpened = false;
  imagePath!: string;

  constructor(public authService: AuthServiceService, private storage: LocalStorageService) { }

  name!: string;
  email!: string;
  password!: string;
  isOwner: boolean = false;
  mobile!: string;

  ngOnInit(): void {
    this.storage.getInf();
    this.checkDeviceType()
    this.setProfileData();
  }

  private setProfileData() {
    if(Inf.isLoged) {
      this.name = Inf.person.name;
      this.email = Inf.person.email;
      this.mobile = Inf.person.mobileNumber;
      this.isOwner = Inf.person.isOwner;
    }
  }

  private checkDeviceType() {
    console.log(screen.width + "x" + screen.height);
    if(screen.width > screen.height) {
      Inf.isDesktop = true;
      this.imagePath = "assets/logo-light.png";
    }
    else {
      Inf.isDesktop = false;
      this.imagePath = "assets/logo-light-sm.png";
    }
  }

  getIsLogedInf(): boolean {
    return Inf.isLoged;
  }
  getPersonInf(): Person {
    return Inf.person;
  }
  getIsDesktop(): boolean {
    return Inf.isDesktop;
  }

  openOverlay(): void {
    let sidebar = document.getElementById('mySidebar') as HTMLElement;
    if (this.isOpened) {
      sidebar.style.width = '0px';

      this.isOpened = false;
    }
    else {
      sidebar.style.width = '200px';

      this.isOpened = true;
    }
  }

  closeOverlay(): void {
    let sidebar = document.getElementById('mySidebar') as HTMLElement;
    sidebar.style.width = '0px';

    this.isOpened = false;
  }

  signUp(form: NgForm):void {
    let person: Person = new Person();
    person.name = form.value.name;
    person.email = form.value.email;
    person.password = form.value.password;
    person.isOwner = form.value.isOwner;
    form.reset();
    this.authService.SignUp(person);

    this.setProfileData();
  }

  logIn(form: NgForm):void {
    let person: Person = new Person();
    person.email = form.value.email;
    person.password = form.value.password;

    form.reset();

    this.authService.LogIn(person);

    this.setProfileData();
  }

  LogOut() {
    this.authService.SignOut();
    location.reload();
  }

  updateProfile(form: NgForm):void {
    let person = Inf.person;
    person.name = form.value.name;
    person.email = form.value.email;
    person.mobileNumber = form.value.mobile;
    person.isOwner = form.value.isOwner;

    this.authService.UpdateProfile(person);
  }

}
