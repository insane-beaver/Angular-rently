import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { HousesForRentComponent } from './pages/houses-for-rent/houses-for-rent.component';
import { HouseCardComponent } from './components/house-card/house-card.component';
import { LocalStorageService } from './services/local-storage.service';

/*ADSENSE*/
import { AdsenseModule } from 'ng2-adsense';

/*GOOGLE PAY*/
import { GooglePayButtonModule } from '@google-pay/button-angular';

/*PAYPAL*/
import { NgxPayPalModule } from 'ngx-paypal';

/*FIREBASE*/
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CreateHouseComponent } from './pages/create-house/create-house.component';
import { OwnerHousesListComponent } from './pages/owner-houses-list/owner-houses-list.component';
import { HouseDetailsComponent } from './pages/house-details/house-details.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MainLayoutComponent,
    HousesForRentComponent,
    HouseCardComponent,
    CreateHouseComponent,
    OwnerHousesListComponent,
    HouseDetailsComponent
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.config),
      AngularFireAuthModule,
      AngularFirestoreModule,
      AngularFireStorageModule,
      FormsModule,
      ReactiveFormsModule,
      AdsenseModule.forRoot({
        adClient: 'ca-pub-7793855420321475',
        adSlot: undefined,
      }),
      GooglePayButtonModule,
      NgxPayPalModule
    ],
  providers: [LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
