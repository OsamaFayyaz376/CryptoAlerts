import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { DisplayPriceComponent } from './MyComponents/display-price/display-price.component';
import { CoinDetailsComponent } from './MyComponents/coin-details/coin-details.component';
import { MapCoinComponent } from './MyComponents/map-coin/map-coin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { ProfitCalculatorComponent } from './MyComponents/profit-calculator/profit-calculator.component';
import { FooterComponent } from './MyComponents/footer/footer.component';
import {FooterService} from "./Services/footer.service";
import {ApiService} from "./Services/api.service";

@NgModule({
  declarations: [
    AppComponent,
    DisplayPriceComponent,
    CoinDetailsComponent,
    MapCoinComponent,
    ProfitCalculatorComponent,
    FooterComponent
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
  providers: [
    ApiService,
    FooterService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
