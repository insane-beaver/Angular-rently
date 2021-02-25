import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import {NgForm} from '@angular/forms';
import {Person} from '../../classes/person';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.sass']
})
export class MainLayoutComponent implements OnInit {
  isOpened = false;

  constructor(public authService: AuthServiceService) { }

  name!: string;
  email!: string;
  password!: string;

  ngOnInit(): void {
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
    this.clearInputs();
    this.authService.SignUp(person);
  }

  logIn(form: NgForm):void {
    let person: Person = new Person();
    person.email = form.value.email;
    person.password = form.value.password;

    form.reset();

    this.authService.LogIn(person);
  }

  private clearInputs() {
    this.name = '';
    this.email = '';
    this.password = '';
  }

}
