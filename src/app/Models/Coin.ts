export class Coin {
  symbol: string | undefined;
  currentPrice: number | undefined;
  investedPrice!: number;
  currentValue!: number;
  pnl!: number;
  quantity: number | undefined;
}
