import React, { useState } from "react";
import { Grid, Link } from "@material-ui/core";
import { ReactComponent as NUStatsLogo } from "../graphics/logo.svg";

import "firebase/auth";

import {
  // eslint-disable-next-line
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";

import styles from "./PageLogin.module.css";
import SignUp from "../component/SignUp/SignUp";
import SignIn from "../component/SignIn/SignIn";

function PageLogin() {
  const [signUpView, setSignUpView] = useState(false);

  const handleSignUpClick = () => {
    setSignUpView(!signUpView);
  };

  return (
    <BrowserRouter>
      <Grid
        container
        direction="column"
        alignItems="center"
        xs={12}
        spacing={3}
      >
        <Grid item xs={12}>
          <NUStatsLogo className={styles.logo} />
        </Grid>
        {signUpView ? (
          <>
            <Grid item xs={12}>
              <SignUp />
            </Grid>
            <Grid item xs={12}>
              <Link
                onClick={() => handleSignUpClick()}
                style={{ cursor: "pointer" }}
              >
                Have an account? Sign in here!
              </Link>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12}>
              <SignIn />
            </Grid>
            <Grid item xs={12}>
              <Link
                onClick={() => handleSignUpClick()}
                style={{ cursor: "pointer" }}
              >
                Don't have an account? Sign up here!
              </Link>
            </Grid>
          </>
        )}
      </Grid>

      <Switch>
        <Route path="/SignUp" render={() => <SignUp />} />
      </Switch>
    </BrowserRouter>
  );
}

export default PageLogin;
