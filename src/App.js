// @flow

import React, { Component } from "react";
import "./App.css";
import debounce from "./debounce";

import * as tsmc from "./toy-stock-market-client";

function LogoutForm(props) {
  return (
    <div>
      {props.username}
      <button onClick={props.logout}>logout</button>
    </div>
  );
}

function LoginForm(props) {
  let uEl, pEl;
  return (
    <div className="login-form">
      <label htmlFor="username">username</label>
      <input ref={el => (uEl = el)} id="username" />
      <br />
      <label htmlFor="password">password</label>
      <input ref={el => (pEl = el)} type="password" id="password" />
      <br />
      <button
        onClick={() => {
          props.login(uEl.value, pEl.value);
        }}
      >
        login
      </button>
      <button
        onClick={() => {
          props.register(uEl.value, pEl.value, 1000);
        }}
      >
        register
      </button>
    </div>
  );
}

function LOB(props) {
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

function Act(props) {
  let stockEl, quantEl, priceEl;
  function _do(action) {
    return function() {
      props.onAction(
        action,
        stockEl.value,
        parseFloat(priceEl.value),
        parseInt(quantEl.value, 10)
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

class App extends Component {
  state: {
    username: ?string,
    stockNames: Array<string>,
    stockLobs: { [string]: Object },
    money: number,
    owns: { [string]: number }
  };

  state = {
    username: undefined,
    stockNames: [],
    stockLobs: {},
    money: 0,
    owns: {}
  };

  updateOwns = () => {
    tsmc.trader().then(o => {
      this.setState({ money: o.money, owns: o.owns });
    });
  };

  updateLobs = () => {
    this.state.stockNames.forEach(name => {
      tsmc.stockLOB(name).then(lob => {
        this.setState((state, props) => {
          const lobs = this.state.stockLobs;
          lobs[name] = lob;
          return { stockLobs: lobs };
        });
      });
    });
  };

  updateStuff = () => {
    this.updateOwns();
    this.updateLobs();
  };

  login = (user: string, pass: string) => {
    tsmc.login(user, pass).then(() => {
      this.setState({ username: tsmc.isLoggedIn() });
      this.updateOwns();
    });
  };

  register = (user: string, pass: string, money: number) => {
    tsmc.register(user, pass, money).then(() => {
      this.setState({ username: tsmc.isLoggedIn() });
      this.updateOwns();
    });
  };

  logout = () => {
    tsmc.logout().then(() => {
      this.setState({ username: undefined, owns: {}, money: 0 });
    });
  };

  act = (action: string, stock: string, price: number, quantity: number) => {
    tsmc[action](stock, price, quantity)
      .then(() => {
        this.updateStuff();
      })
      .catch(err => {
        console.error(err);
      });
  };

  onStreamEvent = ev => {
    console.log("stream event:", ev);
    debounce(() => {
      console.log("debounced refresh"); // @TODO does not seem to be working
      this.updateStuff();
    }, 250);
  };

  componentWillMount() {
    tsmc.stockEventEmitter.on("*", this.onStreamEvent);

    tsmc.stocks().then(names => {
      this.setState({ stockNames: names });
      names.forEach(name => {
        tsmc.stockLOB(name).then(lob => {
          this.setState((state, props) => {
            const lobs = this.state.stockLobs;
            lobs[name] = lob;
            return { stockLobs: lobs };
          });
        });
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.username ? (
          <LogoutForm username={this.state.username} logout={this.logout} />
        ) : (
          <LoginForm login={this.login} register={this.register} />
        )}
        <h2>stocks:</h2>
        <ul>
          {this.state.stockNames.map(n => (
            <li key={n}>
              {n}: <LOB data={this.state.stockLobs[n]} />
            </li>
          ))}
        </ul>
        {this.state.username && (
          <span>
            <h2>money:</h2>
            <span>{this.state.money}</span>

            <h2>owns:</h2>
            <ul>
              {Object.keys(this.state.owns).map(own => {
                return (
                  <li key={own}>
                    {own}: {this.state.owns[own]}
                  </li>
                );
              })}
            </ul>

            <h2>act:</h2>
            <Act
              stockNames={this.state.stockNames}
              onAction={this.act}
              onRequestedRefresh={this.updateStuff}
            />
          </span>
        )}
      </div>
    );
  }
}

export default App;
