//eslint-disable-next-line
import styles from "./styles.css";
import React, { useState } from "react";
import { useAuth, ProvideAuth } from "./auth/AuthHook";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import PageLogin from "./pages/PageLogin";
import PageHome from "./pages/PageHome";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import deepPurple from "@material-ui/core/colors/deepPurple";
import pink from "@material-ui/core/colors/pink";
import grey from "@material-ui/core/colors/grey";

function AppBody() {
  const auth = useAuth();
  const user = auth.user;
  const [theme, setTheme] = useState(true);

  const dark = createMuiTheme({
    typography: {
      fontFamily: [
        '"Poppins"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    palette: {
      type: "dark",
      primary: {
        light: deepPurple[100],
        main: deepPurple[200],
        dark: deepPurple[400],
      },
      secondary: {
        light: pink[300],
        main: pink[500],
        dark: pink[700],
      },
      contrastThreshold: 3,
      tonalOffset: 0.5,
    },
  });

  const light = createMuiTheme({
    typography: {
      fontFamily: [
        '"Poppins"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    palette: {
      type: "light",
      primary: {
        light: deepPurple[200],
        main: deepPurple[500],
        dark: deepPurple[600],
      },
      secondary: {
        light: pink[300],
        main: pink[500],
        dark: pink[700],
      },
      background: {
        default: grey[100],
      },
      contrastThreshold: 3,
      tonalOffset: 0.5,
    },
  });

  return (
    <MuiThemeProvider theme={theme ? dark : light}>
      <CssBaseline />
      {user ? (
        <Redirect to={{ pathname: "/Home" }} />
      ) : (
        <Redirect to={{ pathname: "/Login" }} />
      )}

      <Switch>
        <Route
          path="/Home"
          render={() => <PageHome setTheme={setTheme} theme={theme} />}
        />
        <Route path="/Login" render={() => <PageLogin />} />
      </Switch>
    </MuiThemeProvider>
  );
}

export default function App() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <AppBody />
      </BrowserRouter>
    </ProvideAuth>
  );
}
