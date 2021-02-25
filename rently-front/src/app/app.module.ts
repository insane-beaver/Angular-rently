import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { HousesForRentComponent } from './pages/houses-for-rent/houses-for-rent.component';
import { HouseCardComponent } from './components/house-card/house-card.component';
/*FIREBASE*/
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MainLayoutComponent,
    HousesForRentComponent,
    HouseCardComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
