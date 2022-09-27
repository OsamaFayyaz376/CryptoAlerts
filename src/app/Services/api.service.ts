import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {TickerPrice} from "../Models/TickerPrice";
import {Portfolio} from "../Models/Portfolio";
import {Trade} from "../Models/Trade";
import {TickerStatistic} from "../Models/TickerStatistic";
import {tick} from "@angular/core/testing";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  fetchTickerPrices() {
    return this.http.get<TickerPrice[]>(`${this.url}/coinprices`);
  }

  fetchPortfolio() {
    return this.http.get<Portfolio[]>(`${this.url}/portfolio`);
  }

  getTrade(symbol: string) {
    return this.http.get<Trade[]>(`${this.url}/trade/${symbol}`)
  }

  getTickerStatistic(symbol: string) {
    return this.http.get<TickerStatistic>(`${this.url}/stats/${symbol}`)
  }
}
