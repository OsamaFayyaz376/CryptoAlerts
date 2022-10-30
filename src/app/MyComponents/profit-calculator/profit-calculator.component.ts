import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../Services/api.service";
import {TickerPrice} from "../../Models/TickerPrice";
import {HttpErrorResponse} from "@angular/common/http";
import {PredictedCoin} from "../../Models/PredictedCoin";

@Component({
  selector: 'app-profit-calculator',
  templateUrl: './profit-calculator.component.html',
  styleUrls: ['./profit-calculator.component.css']
})
export class ProfitCalculatorComponent implements OnInit {

  private favouriteCoins: string[] = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "MATICUSDT",
    "ADAUSDT",
    "DOTUSDT",
    "WINGUSDT",
    "AVAXUSDT",
    "AXSUSDT",
    "AAVEUSDT",
    "PYRUSDT",
    "MBOXUSDT",
    "SANDUSDT",
    "MANAUSDT",
    "GALAUSDT",
    "ICPUSDT",
    "KSMUSDT",
    "ALGOUSDT",
    "LUNAUSDT",
    "LUNCUSDT",
    "ARUSDT",
    "IQUSDT",
    "AUCTIONUSDT",
    "WRXUSDT",
    "IDEXUSDT",
  ];

  private investedPrice: number = 100;
  private prices: TickerPrice[] = [];
  predictedCoins: PredictedCoin[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.fetchTickerPrices().subscribe(
      (tickerPrices: TickerPrice[]) => {
        this.prices = tickerPrices.filter(tickerPrice => this.favouriteCoins.includes(tickerPrice.symbol));
        this.mapPredictedCoins();
      },
      (error: HttpErrorResponse) => {
        alert("Error in fetching portfolio")
      }
    )
  }

  getInvestedPrice(inputPrice: string) {
    this.investedPrice = Number(inputPrice);
    this.calculatePNL();
  }

  getCustomPrice(rowCoin: PredictedCoin, event: any) {
    // @ts-ignore
    let coin: PredictedCoin = this.predictedCoins.find(predictedCoin => predictedCoin.symbol === rowCoin.symbol);
    coin.customPrice = Number(event.target.innerText);
    coin.currentWorth = coin.initialWorth * coin.customPrice;
    coin.pnl = coin.currentWorth - this.investedPrice;
  }

  getCurrentPrice(rowCoin: PredictedCoin, event: any) {
    // @ts-ignore
    let coin: PredictedCoin = this.predictedCoins.find(predictedCoin => predictedCoin.symbol === rowCoin.symbol);
    coin.currentPrice = Number(event.target.innerText);
    coin.initialWorth = this.investedPrice / coin.currentPrice;
    if (coin.customPrice !== 0) {
      coin.currentWorth = coin.initialWorth * coin.customPrice;
      coin.pnl = coin.currentWorth - this.investedPrice;
    }
  }

  private calculatePNL() {
    this.predictedCoins.forEach(coin => {
      coin.initialWorth = this.investedPrice / coin.currentPrice;
      coin.currentWorth = coin.initialWorth * coin.customPrice;
      coin.pnl = coin.customPrice === 0 ? 0 : coin.currentWorth - this.investedPrice;
    })
  }

  private mapPredictedCoins() {
    let coin: PredictedCoin;
    this.predictedCoins = [];
    this.prices.forEach(tickerPrice => {
      coin = new PredictedCoin();
      coin.initialWorth = this.investedPrice / tickerPrice.price;
      coin.symbol = tickerPrice.symbol.slice(0, -4);
      coin.currentPrice = Number(Number(tickerPrice.price).toFixed(5));
      coin.customPrice = 0;
      coin.pnl = 0;
      this.predictedCoins.push(coin);
    })
    console.log(this.predictedCoins);
  }
}
