import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./App";
import { ProvideAuth } from "./hooks/AuthHook";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <CssBaseline />
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </StrictMode>,
  rootElement
);
