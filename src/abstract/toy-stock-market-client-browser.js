// @flow

import tsmc from "toy-stock-market-client";

import EventEmitter from "EventEmitter";

export type Transaction = {
  from: string,
  to: string,
  price: number,
  quantity: number,
  stock: string,
  when: number
};

export type BidAskDataLOB = {
  price: number,
  quantity: number
};

export type StockLOB = {
  bids: Array<BidAskDataLOB>,
  asks: Array<BidAskDataLOB>
};

export type HashOfNumber = { [string]: number };

export type TraderWoPass = {
  money: number,
  owns: HashOfNumber // stockName -> quantity
};

export type StockData = { [string]: StockLOB };

export type Stats = {
  traders: number,
  tokens: number,
  stocks: number,
  queuedActions: number
};

export default function(prefix: string) {
  return tsmc({
    fetch,
    EventSource: window.EventSource,
    EventEmitter,
    prefix
  });
}
