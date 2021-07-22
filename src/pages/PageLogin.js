import React from "react";
import { Grid } from "@material-ui/core";
import { ReactComponent as NUStatsLogo } from "../graphics/logo.svg";

import "firebase/auth";

// eslint-disable-next-line
import { Switch, Route, BrowserRouter } from "react-router-dom";

import styles from "./PageLogin.module.css";
import SignIn from "../component/SignIn/SignIn";

function PageLogin() {
  return (
    <BrowserRouter>
      <Grid container direction="column" alignItems="center" spacing={3}>
        <Grid item xs={12}>
          <NUStatsLogo className={styles.logo} />
        </Grid>
        <Grid item xs={12}>
          <SignIn />
        </Grid>
      </Grid>
    </BrowserRouter>
  );
}

export default PageLogin;
