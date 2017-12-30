// @flow

import EventEmitter from "EventEmitter";

function _fetch(url: string) {
  return fetch(url).then(res => {
    const contentType: string = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    }
    throw new TypeError("Oops, we haven't got JSON!");
  });
}

const prefix = "//127.0.0.1:3030";
let username;
let token;

// TRADER AUTH

export function isLoggedIn() {
  return token ? username : false;
}

export function register(user: string, pass: string, money: number) {
  return new Promise((resolve, reject) => {
    _fetch(prefix + "/register/" + user + "/" + pass + "/" + money).then(
      (o: any) => {
        token = o.token;
        username = user;
        resolve(token);
      }
    );
  });
}

export function login(user: string, pass: string) {
  return new Promise((resolve, reject) => {
    _fetch(prefix + "/login/" + user + "/" + pass).then((o: any) => {
      token = o.token;
      username = user;
      resolve(token);
    });
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    _fetch(prefix + "/logout/" + token).then((o: any) => {
      token = undefined;
      username = undefined;
      resolve();
    });
  });
}

// TRADER GETTERS

export function trader() {
  return _fetch(prefix + "/trader/" + token);
}

// TRADER ACTIONS

export function bid(stockName: string, price: number, quantity: number) {
  return new Promise((resolve, reject) => {
    _fetch(
      prefix + "/bid/" + token + "/" + stockName + "/" + price + "/" + quantity
    ).then(o => {
      if (o.ok) {
        resolve();
      } else {
        reject(o.error);
      }
    });
  });
}

export function ask(stockName: string, price: number, quantity: number) {
  return new Promise((resolve, reject) => {
    _fetch(
      prefix + "/ask/" + token + "/" + stockName + "/" + price + "/" + quantity
    ).then(o => {
      if (o.ok) {
        resolve();
      } else {
        reject(o.error);
      }
    });
  });
}

// OPEN ENDPOINTS

export function stocks() {
  return _fetch(prefix + "/stock");
}

export function stockLOB(stockName: string) {
  return _fetch(prefix + "/stock/" + stockName);
}

export function transactions() {
  return _fetch(prefix + "/transactions");
}

export function stats() {
  return _fetch(prefix + "/stats");
}

export const stockEventEmitter = new EventEmitter();

const source = new EventSource(prefix + "/stream");

source.addEventListener("message", ev => {
  const data: any = JSON.parse(ev.data);
  //console.log("SSE", data);
  stockEventEmitter.emit(data.kind, data);
  stockEventEmitter.emit("*", data);
});
