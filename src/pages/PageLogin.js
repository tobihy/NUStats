import React from "react";
import { Button } from "@material-ui/core";
import { ReactComponent as NUStatsLogo } from "../graphics/logo.svg";

import firebase from "firebase/app";
import "firebase/auth";

import { useAuth } from "../hooks/AuthHook";
import "../styles.css";
import styles from "./PageLogin.module.css";

function PageLogin() {
  // Handler for Google sign in
  // const handleGoogleSignIn = (firebase) => {
  //   const authProvider = new firebase.auth.GoogleAuthProvider();
  //   firebase.auth().signInWithPopup(authProvider);
  // };
  const auth = useAuth();

  return (
    <>
      <h1>Welcome to</h1>
      <div className="Logo">
        <NUStatsLogo className={styles.logo} />
      </div>
      <Button variant="contained" color="primary" onClick={() => auth.signin()}>
        Sign in with Google
      </Button>
    </>
  );
}

export default PageLogin;
