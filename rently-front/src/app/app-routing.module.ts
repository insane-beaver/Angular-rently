import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {MainLayoutComponent} from './pages/main-layout/main-layout.component';
import {HousesForRentComponent} from './pages/houses-for-rent/houses-for-rent.component';

const routes: Routes = [
  {path: '', component: MainLayoutComponent, children: [
      {path: '', component: MainPageComponent},
      {path: 'houses-for-rent', component: HousesForRentComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
