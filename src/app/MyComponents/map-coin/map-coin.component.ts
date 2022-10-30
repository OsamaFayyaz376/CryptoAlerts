import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Coin} from "../../Models/Coin";
import {InvestedPrice} from "../../Models/InvestedPrice";
import {Portfolio} from "../../Models/Portfolio";
import {TickerPrice} from "../../Models/TickerPrice";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Trade} from "../../Models/Trade";
import {Subscription, timer} from "rxjs";
import {ApiService} from "../../Services/api.service";
import {TickerStatistic} from "../../Models/TickerStatistic";
import {symbols} from "ansi-colors";

@Component({
  selector: 'app-map-coin',
  templateUrl: './map-coin.component.html',
  styleUrls: ['./map-coin.component.scss']
})
export class MapCoinComponent implements OnInit, OnDestroy {
  coins: Coin[] = [];
  investedPrices: InvestedPrice[] = [];
  portfolio: Portfolio[] = [];
  prices: TickerPrice[] = [];
  tickerStats: TickerStatistic[] = [];
  symbols: string[] = [];
  totalPriceInvested: number = 0;
  totalValue: number = 0;
  totalPNL: number = 0;
  currentSub: Subscription | undefined;
  showSpinner: boolean = true;
  USDTPrice: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchCoin();
  }

  ngOnDestroy() {
    this.currentSub?.unsubscribe();
  }

  fetchCoin() {
    this.fetchPortfolio(() => {
      this.fetchInvestedPrices(() => {
        this.currentSub = timer(1000, 2200).subscribe(
          () => {
            this.getFilteredPrices(() => {
              this.mapCoins();
              this.totalPriceInvested = this.calculateTotalInvestedPrice(this.investedPrices) + Number(this.USDTPrice);
              this.totalValue = this.calculateTotalValue(this.coins);
              this.totalPNL = this.calculateTotalPNL(this.coins);
            });
          })
      })
    })
  }

  getFilteredPrices(onSuccess: any) {
    this.apiService.getTickerStatistic(this.symbols).subscribe(
      (tickerStats: TickerStatistic[]) => {
        this.tickerStats = tickerStats;
      }
    )
    if(this.tickerStats.length === this.portfolio.length - 1) {
      onSuccess();
    }
  }


  fetchPortfolio(onSuccess: any) {
    this.apiService.fetchPortfolio().subscribe(
      (response: Portfolio[]) => {
        this.portfolio = response;
        this.portfolio.forEach(portfolio => {
          if (portfolio.asset != "ETHW" && portfolio.asset != "USDT") {
            this.symbols.push(portfolio.asset + "USDT");
          } else if (portfolio.asset === "USDT") {
            // @ts-ignore
            this.USDTPrice = Number(portfolio.free) + Number(portfolio.locked);
            this.symbols.push("USDC" + portfolio.asset);
          }
        })
        onSuccess();
      },
      (error: HttpErrorResponse) => {
        alert("Error in fetching Portfolio")
      }
    )
  }

  fetchInvestedPrices(onSuccess: any) {
    let investPrice: InvestedPrice;
    let counter: number = 0;
    this.portfolio.forEach(portfolio => {
      this.apiService.getTrade(portfolio.asset + "USDT").subscribe(
        (trades: Trade[]) => {
          counter = 0;
          investPrice = new InvestedPrice();
          investPrice.investedPrice = 0;
          trades.forEach(trade => {
            if (trade.isBuyer) {
              // @ts-ignore
              investPrice.investedPrice = Number(investPrice.investedPrice) + Number(trade.quoteQty);
            } else {
              let index = (counter+trades.length-1)%trades.length;
              let previousTrade = trades[index];
              let doublePreviousTrade = trades[index-1];
              // @ts-ignore
              if (previousTrade.isBuyer && Math.trunc(previousTrade.qty) === Math.trunc(trade.qty) && Math.trunc(trade.quoteQty) >= Math.trunc(previousTrade.quoteQty)) {
                investPrice.investedPrice = Number(investPrice.investedPrice) - Number(previousTrade.quoteQty);
              } else if (!previousTrade.isBuyer && doublePreviousTrade.isBuyer && (Math.trunc(Number(previousTrade.qty))+Math.trunc(Number(trade.qty)) === Math.trunc(Number(doublePreviousTrade.qty)) ||
                Math.trunc(Number(previousTrade.qty))+Math.trunc(Number(trade.qty)) === Math.trunc(Number(doublePreviousTrade.qty)-1))) {
                investPrice.investedPrice = (Number(investPrice.investedPrice) + Number(previousTrade.quoteQty)) - Number(doublePreviousTrade.quoteQty);
                if (Number(Number(investPrice.investedPrice).toFixed(2)) == 0.00) {
                  investPrice.investedPrice = 0;
                }
              } else {
                // @ts-ignore
                investPrice.investedPrice = Number(investPrice.investedPrice) - Number(trade.quoteQty);
              }
            }
            counter++;
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


  private mapCoins() {
    let coin: Coin;
    let tickerStatatistic: TickerStatistic;
    let counter = 0;
    this.coins = [];
    this.portfolio.forEach(portfolio => {

      if(portfolio.asset != "USDT") {
        // @ts-ignore
        tickerStatatistic = this.tickerStats.find(tickerStat => tickerStat.symbol === portfolio.asset + "USDT");
      } else {
        // @ts-ignore
        tickerStatatistic = this.tickerStats.find(tickerStat => tickerStat.symbol === "USDC" + portfolio.asset);
      }

      coin = new Coin();
      coin.symbol = portfolio.asset;

      if (coin.symbol === "LUNC") {
        coin.currentPrice = Number(Number(tickerStatatistic?.price).toFixed(8));
      } else {
        coin.currentPrice = Number(Number(tickerStatatistic?.price).toFixed(4));
      }

      if(!coin.currentPrice) {
        coin.currentPrice = 0;
      }

      if (coin.symbol === "USDT") {
        coin.pnl = 0;
        coin.change = 0;
        coin.currentValue = this.USDTPrice;
        coin.investedPrice = this.USDTPrice;
      } else {
        coin.change = tickerStatatistic?.change;
        coin.quantity = Number(portfolio.free) + Number(portfolio.locked);
        coin.currentValue = Number(coin.currentPrice) * Number(coin.quantity);
        coin.investedPrice = this.investedPrices.find(price => price.symbol === portfolio.asset)?.investedPrice ?? 0;
        coin.pnl = Number(coin.currentValue) - Number(coin.investedPrice);
      }

      if (coin.investedPrice) {
        this.coins.push(coin);
      }

      counter++;
      if(counter === this.portfolio.length) {
        this.tickerStats = [];
        this.showSpinner = false;
      }

    })
  }
}
