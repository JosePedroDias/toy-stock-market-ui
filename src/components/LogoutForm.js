// @flow

import React from "react";

type LogoutFormProps = { username: string, logout: Function };

export default function LogoutForm(props: LogoutFormProps) {
  return (
    <div>
      {props.username}
      <button onClick={props.logout}>logout</button>
    </div>
  );
}
