import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Coin} from "../../Models/Coin";
import {Router} from "@angular/router";
import {FooterService} from "../../Services/footer.service";

@Component({
  selector: 'app-display-price',
  templateUrl: './display-price.component.html',
  styleUrls: ['./display-price.component.css']
})
export class DisplayPriceComponent implements OnInit {
  @Input() data: Coin[] = [];
  @Input() totalPriceInvested: number = 0;
  @Input() totalValue: number = 0;
  @Input() totalPNL: number = 0;
  @Output() showNoFooter: EventEmitter<any> = new EventEmitter();
  showTable: boolean = true;
  // @ts-ignore
  coin: Coin;

  constructor(private footerService: FooterService) {
  }

  ngOnInit(): void {
  }

  showDetails(currentCoin: Coin) {
    this.showTable = false;
    this.footerService.hide();
    this.coin = currentCoin;
  }

  onClose($event: any) {
    this.showTable = true;
  }
}

