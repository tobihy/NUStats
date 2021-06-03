import React from "react";
import GoogleButton from "react-google-button";
import { ReactComponent as NUStatsLogo } from "../graphics/logo.svg";

import "firebase/auth";

import { useAuth } from "../auth/AuthHook";

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
    <main>
      <h1>Welcome to</h1>
      <div className={styles.logo}>
        <NUStatsLogo />
      </div>
      <GoogleButton
        className={styles.loginButton}
        type="dark"
        onClick={() => auth.signin()}
      />
    </main>
  );
}

export default PageLogin;
