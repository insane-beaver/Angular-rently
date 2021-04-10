import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../classes/person';
import { Inf } from '../classes/Inf';
import { DatabaseProviderService } from './database-provider.service';
import { LocalStorageService } from './local-storage.service';

import firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth';
import {NgModel} from '@angular/forms';
import {MainLayoutComponent} from '../pages/main-layout/main-layout.component';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private afAuth: AngularFireAuth, private storage: LocalStorageService, private database: DatabaseProviderService, private router: Router) {}

  GoogleLogIn() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }


  AuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider).then(() => {
        let person:Person = new Person();
        let user = firebase.auth().currentUser;
        if (user != null) {
          person.id = user.uid;
        }
        Inf.isLoged = true;
        Inf.person = person;
        this.storage.saveInf();
        this.database.getPerson();

      }).catch((error) => {
        console.log(error)
      })
  }

  GoogleSignUp() {
    return this.AuthSignUp(new firebase.auth.GoogleAuthProvider());
  }


  AuthSignUp(provider: any) {
    return this.afAuth.signInWithPopup(provider).then(() => {
      let person:Person = new Person();
      let user = firebase.auth().currentUser;
      if (user != null) {
        person.id = user.uid;
        person.email = user.email + '';
        person.name = user.displayName + '';
        person.isOwner = false;
      }
      Inf.isLoged = true;
      Inf.person = person;
      this.storage.saveInf();
      this.database.savePerson();


    }).catch((error) => {
      console.log(error)
    })
  }

  SignUp(person: Person) {
    firebase.auth().createUserWithEmailAndPassword(person.email, person.password)
      .then((userCredential) => {
        var user = firebase.auth().currentUser;
        Inf.isLoged = true;
        person.id = user!.uid;
        Inf.person = person;
        this.storage.saveInf();
        this.database.savePerson();
        user!.updateProfile({
          displayName: person.name
        }).then(function() {
          user!.sendEmailVerification().then(function() {
            console.log("Email sent")
          }).catch(function(error) {
            console.log(error)
          });
        }).catch(function(error) {
          console.log(error)
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }

  user!:any; confirmationResult!:any; person!:any;
  UpdateProfile(person: Person, recaptchaVerifier: firebase.auth.RecaptchaVerifier) {
    this.user = firebase.auth().currentUser;
    this.person = person
    let phoneNumber = Inf.person.mobileNumber.replace('-','');
    phoneNumber = "+38"+phoneNumber.replace('-','');
    firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
        MainLayoutComponent.showVerification();
      }).catch((error) => {
        console.log(error);
      });
  }
  UpdateProfile2(code: NgModel) {
    let user = this.user;
    let person = this.person;
    this.confirmationResult.confirm(code.viewModel.toString()).then((result:any) => {
      result.user?.delete();
      this.storage.saveInf();
      this.database.savePerson();
      user!.updateProfile({
        displayName: person.name
      }).then(function() {
        user!.updateEmail(person.email).then(function() {
        }).catch(function(error:any) {
          console.log(error);
        });
      }).catch(function(error:any) {
        console.log(error);
      });
      setTimeout(() => this.SignOut(), 1000);
    }).catch((error:any) => {
      console.log(error);
    });
  }

  LogIn(person: Person) {
    firebase.auth().signInWithEmailAndPassword(person.email, person.password)
      .then((userCredential) => {
        let person:Person = new Person();
        let user = firebase.auth().currentUser;
        if (user != null) {
          person.id = user.uid;
          person.email = user.email + '';
          person.name = user.displayName + '';
        }
        Inf.isLoged = true;
        Inf.person = person;
        this.storage.saveInf();
        this.database.getPerson();
      })
      .catch((error) => {
        console.log(error)
      });
  }

  SignOut() {
    firebase.auth().signOut().then(() => {
      Inf.isLoged = false;
      Inf.person = new Person();
      this.storage.saveInf();
      this.router.navigateByUrl('/');
    }).catch((error) => {
      console.log(error);
    });
  }
}
