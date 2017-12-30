// @flow

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

export type Stats = {
  traders: number,
  tokens: number,
  stocks: number,
  queuedActions: number
};

type SimpleAnswer = { ok: boolean, error: string };
type TokenAnswer = { ok: boolean, token: string, error: string };

function _fetch(url: string) {
  return fetch(url).then(res => {
    const contentType: string = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    }
    throw new TypeError("Oops, we haven't got JSON!");
  });
}

const prefix = "//" + window.location.hostname + ":3030";
let username: ?string;
let token: ?string;

// TRADER AUTH

export function isLoggedIn(): ?string {
  return token;
}

export function register(
  user: string,
  pass: string,
  money: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    _fetch(prefix + "/register/" + user + "/" + pass + "/" + money).then(
      (o: TokenAnswer) => {
        if (!o.ok) {
          return reject(o.error);
        }
        token = o.token;
        username = user;
        resolve(token);
      }
    );
  });
}

export function login(user: string, pass: string): Promise<string> {
  return new Promise((resolve, reject) => {
    _fetch(prefix + "/login/" + user + "/" + pass).then((o: TokenAnswer) => {
      if (!o.ok) {
        return reject(o.error);
      }
      token = o.token;
      username = user;
      resolve(token);
    });
  });
}

export function logout(): Promise<void> {
  if (typeof token !== "string") {
    return Promise.resolve();
  }
  const token_: string = token;
  return new Promise((resolve, reject) => {
    _fetch(prefix + "/logout/" + token_).then((o: any) => {
      token = undefined;
      username = undefined;
      resolve();
    });
  });
}

// TRADER GETTERS

export function trader(): Promise<TraderWoPass> {
  if (token) {
    return _fetch(prefix + "/trader/" + token);
  }
  return Promise.reject("login first");
}

// TRADER ACTIONS

export function bid(
  stockName: string,
  price: number,
  quantity: number
): Promise<void> {
  if (token) {
    const token_: string = token;
    return new Promise((resolve, reject) => {
      _fetch(
        prefix +
          "/bid/" +
          token_ +
          "/" +
          stockName +
          "/" +
          price +
          "/" +
          quantity
      ).then((o: SimpleAnswer) => {
        if (o.ok) {
          resolve();
        } else {
          reject(o.error);
        }
      });
    });
  }
  return Promise.reject("login first");
}

export function ask(
  stockName: string,
  price: number,
  quantity: number
): Promise<void> {
  if (token) {
    const token_: string = token;
    return new Promise((resolve, reject) => {
      _fetch(
        prefix +
          "/ask/" +
          token_ +
          "/" +
          stockName +
          "/" +
          price +
          "/" +
          quantity
      ).then((o: SimpleAnswer) => {
        if (o.ok) {
          resolve();
        } else {
          reject(o.error);
        }
      });
    });
  }
  return Promise.reject("login first");
}

// OPEN ENDPOINTS

export function stocks(): Promise<Array<string>> {
  return _fetch(prefix + "/stock");
}

export function stockLOB(stockName: string): Promise<StockLOB> {
  return _fetch(prefix + "/stock/" + stockName);
}

export function transactions(): Promise<Array<Transaction>> {
  return _fetch(prefix + "/transactions");
}

export function stats(): Promise<Stats> {
  return _fetch(prefix + "/stats");
}

export const stockEventEmitter: EventEmitter = new EventEmitter();

const source = new window.EventSource(prefix + "/stream");

source.addEventListener("message", ev => {
  const data: any = JSON.parse(ev.data);
  //console.log("SSE", data);
  stockEventEmitter.emit(data.kind, data);
  stockEventEmitter.emit("*", data);
});
