import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import App from "./components/App";

import "./index.css";
import "./wdyr";
import { AuthProvider } from "./context/AuthContextProvider";

if (process.env.REACT_APP_NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    attachStacktrace: true,
    debug: true,
    release: process.env.REACT_APP_RELEASE,
    environment: process.env.REACT_APP_NODE_ENV,
    beforeSend: (event, hint) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(hint?.originalException);
        return null;
      }
      return event;
    }
  });
}

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
