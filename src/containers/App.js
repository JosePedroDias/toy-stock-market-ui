// @flow

import React, { Component } from "react";
import "./App.css";
import debounce from "../debounce";

import tsmcb from "../abstract/toy-stock-market-client-browser";
import type { StockLOB } from "../abstract/toy-stock-market-client-browser";

import LoginForm from "../components/LoginForm";
import LogoutForm from "../components/LogoutForm";
import LOB from "../components/LOB";
import Act from "../components/Act";

const PREFIX = "//" + window.location.hostname + ":3030";
const sm = tsmcb(PREFIX);

type AppProps = {};

type AppState = {
  username: ?string,
  stockNames: Array<string>,
  stockLobs: { [string]: StockLOB },
  money: number,
  owns: { [string]: number }
};

class App extends Component<AppProps, AppState> {
  state = {
    username: undefined,
    stockNames: [],
    stockLobs: {},
    money: 0,
    owns: {}
  };

  updateOwns = () => {
    sm.trader().then(o => {
      this.setState({ money: o.money, owns: o.owns });
    });
  };

  updateLobs = () => {
    this.state.stockNames.forEach(name => {
      sm.stockLOB(name).then(lob => {
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
    sm.login(user, pass).then(() => {
      this.setState({ username: sm.isLoggedIn() });
      this.updateOwns();
    });
  };

  register = (user: string, pass: string, money: number) => {
    sm.register(user, pass, money).then(() => {
      this.setState({ username: sm.isLoggedIn() });
      this.updateOwns();
    });
  };

  logout = () => {
    sm.logout().then(() => {
      this.setState({ username: undefined, owns: {}, money: 0 });
    });
  };

  act = (action: string, stock: string, price: number, quantity: number) => {
    // $FlowFixMe
    sm[action](stock, price, quantity)
      .then(() => {
        this.updateStuff();
      })
      .catch(err => {
        console.error(err);
      });
  };

  onStreamEvent = (ev: Object) => {
    console.log("stream event:", ev);
    debounce(() => {
      console.log("debounced refresh"); // @TODO does not seem to be working
      this.updateStuff();
    }, 250);
  };

  componentWillMount() {
    sm.stockEventEmitter.on("*", this.onStreamEvent);

    sm.stocks().then(names => {
      this.setState({ stockNames: names });
      names.forEach(name => {
        sm.stockLOB(name).then(lob => {
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
