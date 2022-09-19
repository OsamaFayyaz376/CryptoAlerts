import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { DisplayPriceComponent } from './MyComponents/display-price/display-price.component';
import {Coin} from "./Models/Coin";
import { CoinDetailsComponent } from './MyComponents/coin-details/coin-details.component';
import { MapCoinComponent } from './MyComponents/map-coin/map-coin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    DisplayPriceComponent,
    CoinDetailsComponent,
    MapCoinComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [Coin],
  bootstrap: [AppComponent]
})
export class AppModule { }
