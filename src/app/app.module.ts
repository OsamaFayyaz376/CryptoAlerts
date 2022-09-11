import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { DisplayPriceComponent } from './MyComponents/display-price/display-price.component';
import {Coin} from "./Models/Coin";

@NgModule({
  declarations: [
    AppComponent,
    DisplayPriceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [Coin],
  bootstrap: [AppComponent]
})
export class AppModule { }
