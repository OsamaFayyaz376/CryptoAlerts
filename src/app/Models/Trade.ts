export class Trade {
  price: number | undefined;
  qty: number | undefined;
  quoteQty: number | undefined;
  commission: number | undefined;
  commissionAsset: string | undefined;
  time: number | undefined;
  symbol: string | undefined;
  orderId: number | undefined;
  id: number | undefined;
  isBuyer: boolean | undefined;
  isMaker: boolean | undefined;
  isBestMatch: boolean | undefined;
}
