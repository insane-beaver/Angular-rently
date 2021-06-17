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

/*Translation*/
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

/*PLACES*/
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

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
import { FaqAndHelpComponent } from './pages/faq-and-help/faq-and-help.component';
import { EulaComponent } from './components/eula/eula.component';
import { OwnerDetailsComponent } from './pages/owner-details/owner-details.component';
import { RentsListComponent } from './pages/rents-list/rents-list.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MainLayoutComponent,
    HousesForRentComponent,
    HouseCardComponent,
    CreateHouseComponent,
    OwnerHousesListComponent,
    HouseDetailsComponent,
    FaqAndHelpComponent,
    EulaComponent,
    OwnerDetailsComponent,
    RentsListComponent,
    ClientsComponent,
    NotFoundComponent
  ],
    imports: [
      BrowserModule.withServerTransition({ appId: 'serverApp' }),
      AppRoutingModule,
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
        }
      }),
      AngularFireModule.initializeApp(environment.config),
      AngularFireAuthModule,
      AngularFirestoreModule,
      AngularFireStorageModule,
      FormsModule,
      ReactiveFormsModule,
      AdsenseModule.forRoot({
        adClient: 'ca-pub-7793855420321475',
        adSlot: 6040528420
      }),
      GooglePayButtonModule,
      NgxPayPalModule,
      GooglePlaceModule
    ],
  providers: [LocalStorageService],
  bootstrap: [AppComponent]
})

export class AppModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
