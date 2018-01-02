// @flow

import React from "react";
import type { StockLOB } from "../abstract/toy-stock-market-client-browser";

type LOBProps = {
  data: StockLOB
};

export default function LOB(props: LOBProps) {
  if (!props.data) return "";
  const bids = props.data.bids;
  const asks = props.data.asks;
  return (
    <table className="lob">
      <tbody>
        <tr>
          <td>bid</td>
          <td>ask</td>
        </tr>
        <tr>
          <td>
            {bids.map(b => (
              <div key={"" + b.price}>
                <span>{b.quantity}</span>|
                <span>{b.price}</span>
              </div>
            ))}
          </td>
          <td>
            {asks.map(b => (
              <div key={"" + b.price}>
                <span>{b.quantity}</span>|
                <span>{b.price}</span>
              </div>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
