import {AfterViewInit, Component, OnInit} from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import {NgForm, NgModel} from '@angular/forms';
import {Person} from '../../classes/person';
import { LocalStorageService } from '../../services/local-storage.service';
import { Inf } from '../../classes/Inf';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.sass']
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  isOpened = false;
  imagePath!: string;

  constructor(public authService: AuthServiceService, private storage: LocalStorageService) { }

  name!: string;
  email!: string;
  password!: string;
  isOwner: boolean = false;
  agrrEula: boolean = false;
  mobile!: string;
  verCode!: number;
  recaptchaVerifier!: firebase.auth.RecaptchaVerifier;
  recaptchaSolved: boolean = false;

  ngOnInit(): void {
    window.onscroll = function(){
      let header = document.getElementById("header") as HTMLElement;
      let scrollToTopBtn = document.getElementById("scrollToTopBtn") as HTMLElement;
      let sticky = header.offsetTop;

      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        scrollToTopBtn.style.display = "block"
      } else {
        header.classList.remove("sticky");
        scrollToTopBtn.style.display = "none"
      }
    };

    this.storage.getInf();
    this.checkDeviceType();
    this.setProfileData();

    window.addEventListener("orientationchange", function() {
      if(!Inf.isDesktop) {
        if(window.screen.orientation.angle != 0)
          alert("Rotate your phone to portrait mode");
      }
    });
  }
  ngAfterViewInit(): void {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'callback': (response: any) => {
        console.log("reCAPTCHA solved");
        this.recaptchaSolved = true;
      }
    });
    this.recaptchaVerifier.render();
  }

  scrollToTop() {
    let rootElement = document.documentElement
    rootElement.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  setProfileData() {
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

  toggleOverlay(options?: number): void {
    let button = document.getElementById('menu') as HTMLElement;
    let sidebar = document.getElementById('mySidebar') as HTMLElement;
    let sidebarContent = document.getElementById('sidebar-content') as HTMLElement;
    if(options==1) {
      if (this.isOpened) {
        button.classList.toggle('opened');
        button.setAttribute('aria-expanded', String(button.classList.contains('opened')));

        sidebar.style.width = '0px';
        sidebarContent.className = "sidebar-content-close"

        this.isOpened = false;
      }
    }
    else {
      button.classList.toggle('opened');
      button.setAttribute('aria-expanded', String(button.classList.contains('opened')));

      if (this.isOpened) {
        sidebar.style.width = '0px';
        sidebarContent.className = "sidebar-content-close"

        this.isOpened = false;
      }
      else {
        sidebar.style.width = '200px';
        sidebarContent.className = "sidebar-content-open"

        this.isOpened = true;
      }
    }
  }

  eulaCheck() {
    if(!this.agrrEula)
      this.agrrEula = true;
    else
      this.agrrEula = false;
  }

  validateMobile(mobileInput: NgModel) {
    let arr: string[] = mobileInput.viewModel.split('');
    arr.forEach(element => {
      if(element == '-') arr.splice(arr.indexOf(element),1);
    });
    if(arr.length>=3)
      arr.splice(3, 0, '-');
    if(arr.length>=7)
      arr.splice(7, 0, '-');
    this.mobile = arr.join('');
  }

  signUp(form: NgForm):void {
    let person: Person = new Person();
    person.name = form.value.name;
    person.email = form.value.email;
    person.password = form.value.password;
    person.isOwner = false;
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

    if(this.recaptchaSolved) {
      this.authService.UpdateProfile(person, this.recaptchaVerifier);
    }
  }
  public static showVerification() {
    let div = document.getElementById('verification-code') as HTMLElement;
    div.style.display = 'block';
  }


}
