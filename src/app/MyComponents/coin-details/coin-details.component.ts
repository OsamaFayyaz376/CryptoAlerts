import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Coin} from "../../Models/Coin";
import {MatSliderChange} from "@angular/material/slider";

@Component({
  selector: 'app-coin-details',
  templateUrl: './coin-details.component.html',
  styleUrls: ['./coin-details.component.css']
})
export class CoinDetailsComponent implements OnInit {
  // @ts-ignore
  @Input() coin: Coin;
  @Output() close: EventEmitter<any> = new EventEmitter();
  idealPrice: number = 0;
  investedPrice: number = 0;
  coinQuantity: number = 0;
  currentValue: number = 0;
  pnl: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.idealPrice = this.coin.investedPrice / this.coin.quantity;
    this.investedPrice = this.coin.investedPrice;
    this.coinQuantity = this.coin.quantity;
    this.currentValue = this.coin.currentValue;
    this.pnl = this.coin.pnl;
  }

  onClick() {
    this.close.emit();
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + '%';
    }
    return value;
  }

  keyup(inputPrice: string) {
    this.currentValue = Number(inputPrice) * this.coinQuantity;
    this.pnl = this.currentValue - this.investedPrice;
  }

  onInputChange(event: MatSliderChange) {
    let value = Number(event.value)/1000
    this.investedPrice = (this.coin.investedPrice * (value / 100));
    this.currentValue = (this.coin.currentValue * (value / 100));
    this.coinQuantity = (this.coin.quantity * (value / 100));
    this.pnl = (this.coin.pnl * (value / 100));
  }
}
