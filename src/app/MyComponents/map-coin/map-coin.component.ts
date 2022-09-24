import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Coin} from "../../Models/Coin";
import {InvestedPrice} from "../../Models/InvestedPrice";
import {Portfolio} from "../../Models/Portfolio";
import {TickerPrice} from "../../Models/TickerPrice";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Trade} from "../../Models/Trade";
import {Subscription, timer} from "rxjs";
import {FooterService} from "../../Services/footer.service";
import {ApiService} from "../../Services/api.service";

@Component({
  selector: 'app-map-coin',
  templateUrl: './map-coin.component.html',
  styleUrls: ['./map-coin.component.css']
})
export class MapCoinComponent implements OnInit, OnDestroy {
  coins: Coin[] = [];
  investedPrices: InvestedPrice[] = [];
  portfolio: Portfolio[] = [];
  prices: TickerPrice[] = [];
  totalPriceInvested: number = 0;
  totalValue: number = 0;
  totalPNL: number = 0;
  currentSub: Subscription | undefined;
  showSpinner: boolean = true;

  constructor(private footerService: FooterService,
              private apiService: ApiService) { }

  ngOnInit() {
    this.footerService.hide();
    this.fetchCoin();
  }

  ngOnDestroy() {
    this.currentSub?.unsubscribe();
  }

  fetchCoin() {
    this.fetchPortfolio(() => {
      this.fetchInvestedPrices(() => {
        this.currentSub = timer(1000, 1800).subscribe(
          () => {
            this.apiService.fetchTickerPrices().subscribe(
              (tickerPrices: TickerPrice[]) => {
                this.showSpinner = false;
                this.footerService.show();
                this.prices = tickerPrices.filter(tickerPrice => this.investedPrices.find(investedPrice => investedPrice.symbol + "USDT" === tickerPrice.symbol))
                this.mapCoin();
                this.totalPriceInvested = this.calculateTotalInvestedPrice(this.investedPrices);
                this.totalValue = this.calculateTotalValue(this.coins);
                this.totalPNL = this.calculateTotalPNL(this.coins);
              },
              (error: HttpErrorResponse) => {
                alert("Error in fetching portfolio")
              }
            );
          }
        )
      })
    })
  }

  fetchPortfolio(onSuccess: any) {
    this.apiService.fetchPortfolio().subscribe(
      (response: Portfolio[]) => {
        this.portfolio = response;
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
      this.apiService.getTrade(portfolio.asset + "USDT").subscribe(
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
    onSuccess();
  }

  private calculateTotalInvestedPrice(investedPrices: InvestedPrice[]) {
    return investedPrices.reduce(function (accumulator, curValue) {
      // @ts-ignore
      return accumulator + curValue.investedPrice;
    }, 0)
  }

  private calculateTotalValue(coins: Coin[]) {
    return coins.reduce(function (accumulator, curValue) {
      // @ts-ignore
      return accumulator + curValue.currentValue;
    }, 0)
  }

  private calculateTotalPNL(coins: Coin[]) {
    return coins.reduce(function (accumulator, curValue) {
      // @ts-ignore
      return accumulator + curValue.pnl;
    }, 0)
  }


  private mapCoin() {
    let coin: Coin;
    this.coins = [];
    this.portfolio.forEach(portfolio => {
      coin = new Coin();
      coin.symbol = portfolio.asset;
      coin.currentPrice = Number(Number(this.prices.find(price => {
        if (portfolio.asset != "USDT") {
          return price.symbol === portfolio.asset + "USDT"
        }
        return price.symbol === "USDC" + portfolio.asset;
      })?.price).toFixed(5)) ?? 0;
      if(!coin.currentPrice) {
        coin.currentPrice = 0;
      }
      coin.quantity = Number(portfolio.free) + Number(portfolio.locked);
      coin.investedPrice = this.investedPrices.find(price => price.symbol === portfolio.asset)?.investedPrice ?? 0;
      coin.currentValue = Number(coin.currentPrice) * Number(coin.quantity);
      coin.pnl = Number(coin.currentValue) - Number(coin.investedPrice);
      if (coin.investedPrice) {
        this.coins.push(coin);
      }
    })
  }
}
