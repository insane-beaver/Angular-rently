import {Component, Input, OnInit} from '@angular/core';
import {Inf} from '../../classes/Inf';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {House} from '../../classes/house';
import {NgForm} from '@angular/forms';
import {DatabaseProviderService} from '../../services/database-provider.service';
import firebase from 'firebase';

@Component({
  selector: 'app-create-house',
  templateUrl: './create-house.component.html',
  styleUrls: ['./create-house.component.sass']
})
export class CreateHouseComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private database: DatabaseProviderService) { }

  house: House = new House();
  isNewHouse = true;
  agrrEula!: boolean;

  ngOnInit(): void {
    if(!Inf.person.isOwner)
      this.router.navigateByUrl('/');

    this.route.params.subscribe((params: Params) => {
      this.house = new House();
      if(params.id) {
        this.house = this.database.getHouse(params.id);
        this.isNewHouse = false;
      } else {
        this.isNewHouse = true;
      }
    })
  }

  eulaCheck() {
    if(!this.agrrEula)
      this.agrrEula = true;
    else
      this.agrrEula = false;
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var storageRef = firebase.storage().ref();
      var uploadTask = storageRef.child("images/"+Inf.person.id+"/"+Date.now()+"-"+event.target.files[0].name).put(event.target.files[0]);

      uploadTask.on('state_changed', (snapshot) => {
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              break;
            case firebase.storage.TaskState.RUNNING:
              break;
          }
        },
        (error) => {
        console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.house.photos.push(downloadURL);
            console.log(downloadURL);
          });
        });
    }
  }

  removeImage(image: String) {
    let i:number;
    this.house.photos.forEach(element => {
      if(element == image)
      {
        i = this.house.photos.indexOf(image);
        this.house.photos.splice(i,1);
      }
    })
  }

  addHouse(form: NgForm):void {
    let alert = <HTMLElement> document.getElementById('alert');
    if (form.invalid) {
      alert.style.display = 'block';
      window.scrollTo(0, 0);
    }
    else {
      alert.style.display = 'none';

      this.house.ownerId = Inf.person.id;
      this.house.category = form.value.category;
      this.house.price = form.value.price;
      this.house.country = form.value.country;
      this.house.city = form.value.city;
      this.house.postalCode = form.value.postalCode;
      this.house.roomsNumber = form.value.roomsNumber;
      this.house.bathroomsNumber = form.value.bathroomsNumber;
      this.house.description = form.value.description;

      if(this.isNewHouse)
      {
        this.house.id = Inf.person.id + "-" + Date.now();

        this.database.saveHouse(this.house);
      }
      else
        this.database.changeHouse(this.house);

      console.log(this.house);
      form.reset();
      this.router.navigateByUrl('/');
    }
  }
}
