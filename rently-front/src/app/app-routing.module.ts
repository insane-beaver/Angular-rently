import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {MainLayoutComponent} from './pages/main-layout/main-layout.component';
import {HousesForRentComponent} from './pages/houses-for-rent/houses-for-rent.component';
import {CreateHouseComponent} from './pages/create-house/create-house.component';
import {OwnerHousesListComponent} from './pages/owner-houses-list/owner-houses-list.component';
import {HouseDetailsComponent} from './pages/house-details/house-details.component';
import {FaqAndHelpComponent} from './pages/faq-and-help/faq-and-help.component';
import {OwnerDetailsComponent} from './pages/owner-details/owner-details.component';

const routes: Routes = [
  {path: '', component: MainLayoutComponent, children: [
      {path: '', component: MainPageComponent},
      {path: 'houses-for-rent', component: HousesForRentComponent},
      {path: 'my-advertisements', component: OwnerHousesListComponent},
      {path: 'create-house', component: CreateHouseComponent},
      {path: 'create-house/:id', component: CreateHouseComponent},
      {path: 'house-details/:id', component: HouseDetailsComponent},
      {path: 'owner-details/:id', component: OwnerDetailsComponent},
      {path: 'faq', component: FaqAndHelpComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
