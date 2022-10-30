import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Coin} from "../../Models/Coin";
import {ApiService} from "../../Services/api.service";
import {Trade} from "../../Models/Trade";
import {Subscription, timer} from "rxjs";
import {TickerStatistic} from "../../Models/TickerStatistic";
import {TickerPrice} from "../../Models/TickerPrice";

@Component({
  selector: 'app-view-transaction-history',
  templateUrl: './view-transaction-history.component.html',
  styleUrls: ['./view-transaction-history.component.css']
})
export class ViewTransactionHistoryComponent implements OnInit, OnDestroy {

  // @ts-ignore
  @Input() coin: Coin;
  @Output() close: EventEmitter<any> = new EventEmitter();
  trades: Trade[] = [];
  currentSub: Subscription | undefined;
  // @ts-ignore
  tickerPrice: TickerPrice = null;
  pnl: number = 0;
  pnlPercentage: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchTrade(() => {
      this.currentSub = timer(1000, 800).subscribe(
        () => {
          this.getFilteredPrices()
        })
    })
  }

  getFilteredPrices() {
    this.apiService.fetchCoinPrice(this.coin.symbol + "USDT").subscribe(
      (tickerPrice: TickerPrice) => {
        this.tickerPrice = tickerPrice;
      }
    )
  }

  fetchTrade(onSuccess: any) {
    this.apiService.getTrade(this.coin.symbol + "USDT").subscribe(
      (trades: Trade[]) => {
        this.trades = trades.filter(trade => trade.isBuyer == true);
      }
    )
    onSuccess();
  }

  ngOnDestroy() {
    this.currentSub?.unsubscribe();
  }

  getTradePNL(trade: Trade, coin: Coin): Number {
    // @ts-ignore
    return (Number(trade.qty * this.tickerPrice.price) - Number(trade.quoteQty)).toFixed(2);
  }

  getTradeCurrentValue(trade: Trade, coin: Coin): Number {
    // @ts-ignore
    return (Number(trade.qty * this.tickerPrice.price)).toFixed(2);
  }

  getTradeQuantity(trade: Trade): Number {
    // @ts-ignore
    return Number(trade.quoteQty).toFixed(2);
  }

  getTradePrice(trade: Trade) {
    return Number(trade.price).toFixed(8);
  }

  getPercentage(trade: Trade, coin: Coin): Number {
    // @ts-ignore
    return Number(Number(Number(Number(trade.qty * this.tickerPrice.price) - Number(trade.quoteQty)) / Number(trade.quoteQty)) * 100).toFixed(0);
  }

  showCoinDetails() {
    this.close.emit();
  }
}
