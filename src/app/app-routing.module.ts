import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MapCoinComponent} from "./MyComponents/map-coin/map-coin.component";
import {ProfitCalculatorComponent} from "./MyComponents/profit-calculator/profit-calculator.component";

const routes: Routes = [
  { path: '', component: MapCoinComponent },
  { path: 'calculator', component:  ProfitCalculatorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
