import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../classes/person';
import { Inf } from '../classes/Inf';

import firebase from 'firebase/app' // then use the full path to get the auth service. firebase.auth.
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private afAuth: AngularFireAuth) { }

  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }


  AuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider).then(() => {
        let person:Person = new Person();
        let user = firebase.auth().currentUser;
        if (user != null) {
          person.id = user.uid;
          person.email = user.email + '';
          person.name = user.displayName + '';
        }
        console.log("Success",person);
        Inf.isLoged = true;
        Inf.person = person;
      }).catch((error) => {
        console.log(error)
      })
  }

  SignUp(person: Person) {
    firebase.auth().createUserWithEmailAndPassword(person.email, person.password)
      .then((userCredential) => {
        var user = firebase.auth().currentUser;
        user!.updateProfile({
          displayName: person.name
        }).then(function() {
          user!.sendEmailVerification().then(function() {
            console.log("Email sent")
            Inf.isLoged = true;
            Inf.person = person;
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
        console.log("Success",person);
        Inf.isLoged = true;
        Inf.person = person;
      })
      .catch((error) => {
        console.log(error)
      });
  }
}
