// @flow

import React, { Component } from "react";
import "./App.css";

import * as tsmc from "./toy-stock-market-client";

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
          props.cb(uEl.value, pEl.value);
        }}
      >
        login
      </button>
    </div>
  );
}

class App extends Component {
  state: {
    username: ?string,
    stockNames: Array<string>
  };

  state = {
    username: undefined,
    stockNames: []
  };

  login = (user: string, pass: string) => {
    tsmc.login(user, pass).then(() => {
      this.setState({ username: tsmc.isLoggedIn() });
    });
  };

  componentWillMount() {
    tsmc.stocks().then(names => {
      this.setState({ stockNames: names });
    });
  }

  render() {
    return (
      <div>
        {this.state.username ? (
          this.state.username
        ) : (
          <LoginForm cb={this.login} />
        )}

        <h2>stocks:</h2>
        <ul>{this.state.stockNames.map(n => <li key={n}>{n}</li>)}</ul>
      </div>
    );
  }
}

export default App;
