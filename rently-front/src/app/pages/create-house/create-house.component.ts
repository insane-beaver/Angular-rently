import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Inf} from '../../classes/Inf';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {House} from '../../classes/house';
import {NgForm} from '@angular/forms';
import {DatabaseProviderService} from '../../services/database-provider.service';
import firebase from 'firebase/app';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {Address} from 'ngx-google-places-autocomplete/objects/address';

import {ChartOptions, ChartType, ChartDataSets} from 'chart.js';
import {Label} from 'ng2-charts';
import {Payment} from '../../classes/payment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create-house',
  templateUrl: './create-house.component.html',
  styleUrls: ['./create-house.component.sass']
})
export class CreateHouseComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private database: DatabaseProviderService, public translate: TranslateService) {
  }

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [{data: [], label: ''}];

  house: House = new House();
  isNewHouse = true;
  agrrEula!: boolean;

  ngOnInit(): void {
    if (!Inf.person.isOwner) {
      this.router.navigateByUrl('/');
    }

    this.route.params.subscribe((params: Params) => {
      this.house = new House();
      if (params.id) {
        this.house = this.database.getHouse(params.id);

        this.database.getPaymentsFor(this.house.id).then(payments => {
          let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          payments.forEach(payment => {
            if (payment.startMonth <= payment.endMonth) {
              for (let i = payment.startMonth; i <= payment.endMonth; ++i) {
                data[i - 1] += 1;
              }
            } else if (payment.endMonth <= payment.startMonth) {
              for (let i = payment.startMonth; i <= 12; ++i) {
                data[i - 1] += 1;
              }
              for (let i = 1; i <= payment.endMonth; ++i) {
                data[i - 1] += 1;
              }
            }
          });
          setTimeout(() => {
            this.barChartData = [{data: data, label: this.translate.instant('rentsInMonth')}];
          }, 100);
        });
        this.isNewHouse = false;
      } else {
        this.isNewHouse = true;
      }
    });
  }

  eulaCheck() {
    if (!this.agrrEula) {
      this.agrrEula = true;
    } else {
      this.agrrEula = false;
    }
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var storageRef = firebase.storage().ref();
      var uploadTask = storageRef.child('images/' + Inf.person.id + '/' + Date.now() + '-' + event.target.files[0].name).put(event.target.files[0]);

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
    let i: number;
    this.house.photos.forEach(element => {
      if (element == image) {
        i = this.house.photos.indexOf(image);
        this.house.photos.splice(i, 1);
      }
    });
  }

  /*PLaces*/
  @ViewChild('placesRef') placesRef!: GooglePlaceDirective;
  private address!: Address;
  private addressTouched: boolean = false;

  public handleAddressChange(address: Address) {
    this.address = address;
    this.setAddress();
    this.addressTouched = true;
  }

  private setAddress() {
    if (this.address.address_components.length == 7) {
      this.house.addressLine1 = this.address.address_components[1].long_name + ', ' + this.address.address_components[0].long_name;
      this.house.city = this.address.address_components[2].long_name;
      this.house.country = this.address.address_components[5].long_name;
      this.house.postalCode = this.address.address_components[6].long_name;
    } else if (this.address.address_components.length == 6) {
      this.house.addressLine1 = this.address.address_components[0].long_name;
      this.house.city = this.address.address_components[1].long_name;
      this.house.country = this.address.address_components[4].long_name;
      this.house.postalCode = this.address.address_components[5].long_name;
    } else if (this.address.address_components.length == 5) {
      this.house.city = this.address.address_components[0].long_name;
      this.house.country = this.address.address_components[3].long_name;
      this.house.postalCode = this.address.address_components[4].long_name;
    }
  }

  addHouse(form: NgForm): void {
    let alert = <HTMLElement> document.getElementById('alert');
    if (form.invalid) {
      alert.style.display = 'block';
      window.scrollTo(0, 0);
    } else {
      alert.style.display = 'none';

      this.house.ownerId = Inf.person.id;
      this.house.category = form.value.category;
      this.house.price = form.value.price;
      this.house.country = form.value.country;
      this.house.city = form.value.city;
      this.house.addressLine1 = form.value.addressLine1;
      this.house.addressLine2 = form.value.addressLine2;
      if (this.house.addressLine2 == undefined) {
        this.house.addressLine2 = '';
      }
      this.house.postalCode = form.value.postalCode;
      if (this.addressTouched) {
        this.setAddress();
      }
      this.house.roomsNumber = form.value.roomsNumber;
      this.house.bathroomsNumber = form.value.bathroomsNumber;
      this.house.description = form.value.description;

      if (this.isNewHouse) {
        this.house.id = Inf.person.id + '-' + Date.now();

        this.database.saveHouse(this.house);
      } else {
        this.database.changeHouse(this.house);
      }

      console.log(this.house);
      form.reset();
      this.router.navigateByUrl('/');
    }
  }
}
