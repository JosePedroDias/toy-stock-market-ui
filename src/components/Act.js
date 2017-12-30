// @flow

import React from "react";

type Action = "bid" | "ask";

type ActProps = {
  onAction: (
    action: Action,
    stockName: string,
    price: number,
    quantity: number
  ) => void,
  stockNames: Array<string>,
  onRequestedRefresh: Function
};

export default function Act(props: ActProps) {
  let stockEl: ?HTMLSelectElement;
  let quantEl: ?HTMLInputElement;
  let priceEl: ?HTMLInputElement;

  function _do(action) {
    return function() {
      props.onAction(
        action,
        (stockEl && stockEl.value) || "",
        parseFloat((priceEl && priceEl.value) || 0),
        parseInt((quantEl && quantEl.value) || 0, 10)
      );
    };
  }
  return (
    <div>
      <label htmlFor="stock-act">stock</label>
      <select id="stock-act" ref={el => (stockEl = el)}>
        {props.stockNames.map(sn => <option key={sn}>{sn}</option>)}
      </select>
      <br />
      <label htmlFor="quantity-act">quantity</label>
      <input id="quantity-act" type="number" ref={el => (quantEl = el)} />
      <br />
      <label htmlFor="price-act">price</label>
      <input id="price-act" type="number" ref={el => (priceEl = el)} />
      <br />
      <button onClick={_do("bid")}>bid (buy)</button>
      <button onClick={_do("ask")}>ask (sell)</button>
      <button onClick={props.onRequestedRefresh}>refresh</button>
    </div>
  );
}
