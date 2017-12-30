// @flow

import React from "react";

type LoginFormProps = {
  login: (username: string, password: string) => void,
  register: (username: string, password: string, money: number) => void
};

export default function LoginForm(props: LoginFormProps) {
  let uEl: ?HTMLInputElement;
  let pEl: ?HTMLInputElement;
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
          const u = (uEl && uEl.value) || "";
          const p = (pEl && pEl.value) || "";
          props.login(u, p);
        }}
      >
        login
      </button>
      <button
        onClick={() => {
          const u = (uEl && uEl.value) || "";
          const p = (pEl && pEl.value) || "";
          props.register(u, p, 100);
        }}
      >
        register
      </button>
    </div>
  );
}
