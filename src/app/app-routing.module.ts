import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {CoinDetailsComponent} from "./MyComponents/coin-details/coin-details.component";
import {MapCoinComponent} from "./MyComponents/map-coin/map-coin.component";

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
