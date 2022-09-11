import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Coin} from "./Models/Coin";
import {environment} from "../environments/environment";
import {Portfolio} from "./Models/Portfolio";
import {InvestedPrice} from "./Models/InvestedPrice";
import {Trade} from "./Models/Trade";
import {TickerPrice} from "./Models/TickerPrice";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  url: string = environment.baseUrl;
  coins: Coin[] = [];
  investedPrices: InvestedPrice[] = [];
  portfolio: Portfolio[] = [];
  prices: TickerPrice[] = [];
  totalPriceInvested: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchPortfolio(() => {
      this.fetchInvestedPrices(() => {
        setInterval(() => {
          this.fetchTickerPrices().subscribe(
            (tickerPrices: TickerPrice[]) => {
              console.log(tickerPrices);
              this.prices = tickerPrices.filter(tickerPrice => this.investedPrices.find(investedPrice => investedPrice.symbol + "USDT" === tickerPrice.symbol))
              console.log(this.prices);
              this.mapCoin();
              this.totalPriceInvested = this.calculateTotalInvestedPrice(this.coins);
            },
            (error: HttpErrorResponse) => {
              alert("Error in fetching portfolio")
            }
          );
        }, 3000);
      })
    })
  }

  fetchTickerPrices() {
    return this.http.get<TickerPrice[]>(`${this.url}/coinprices`);
  }

  fetchPortfolio(onSuccess: any) {
    this.http.get<Portfolio[]>(`${this.url}/portfolio`).subscribe(
      (response: Portfolio[]) => {
        this.portfolio = response;
        console.log(this.portfolio);
        onSuccess();
      },
      (error: HttpErrorResponse) => {
        alert("Error in fetching Portfolio")
      }
    )
  }

  fetchInvestedPrices(onSuccess: any) {
    let investPrice: InvestedPrice;
    this.portfolio.forEach(portfolio => {
      this.http.get<Trade[]>(`${this.url}/trade/${portfolio.asset+"USDT"}`).subscribe(
        (trades: Trade[]) => {
          investPrice = new InvestedPrice();
          investPrice.investedPrice = 0;
          trades.forEach(trade => {
            if (trade.isBuyer) {
              // @ts-ignore
              investPrice.investedPrice = Number(investPrice.investedPrice) + Number(trade.quoteQty);
            } else {
              // @ts-ignore
              investPrice.investedPrice = Number(investPrice.investedPrice) - Number(trade.quoteQty);
            }
          })
          investPrice.symbol = portfolio.asset;
          this.investedPrices.push(investPrice);
        }
      )
    })
    console.log(this.investedPrices);
    onSuccess();
  }

  private calculateTotalInvestedPrice(coins: Coin[]) {
    return coins.reduce(function (accumulator, curValue) {
      // @ts-ignore
      return accumulator + curValue.investedPrice;
    }, 0)
  }

  private mapCoin() {
    let coin: Coin;
    this.coins = [];
    console.log(this.portfolio);
    console.log(this.prices);
    console.log(this.investedPrices);
    this.portfolio.forEach(portfolio => {
      coin = new Coin();
      coin.symbol = portfolio.asset;
      coin.currentPrice = this.prices.find(price => price.symbol === portfolio.asset + "USDT")?.price;
      coin.quantity = Number(portfolio.free) + Number(portfolio.locked);
      coin.investedPrice = this.investedPrices.find(price => price.symbol === portfolio.asset)?.investedPrice;
      coin.currentValue = Number(coin.currentPrice) * Number(coin.quantity);
      coin.pnl = Number(coin.currentValue) - Number(coin.investedPrice);
      this.coins.push(coin);
    })
    console.log(this.coins);
  }
}
