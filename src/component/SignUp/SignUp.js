import React, { useState } from "react";
import { Button, Grid, InputAdornment } from "@material-ui/core";

import "firebase/auth";
import firebase from "../../auth/AuthHook";
import { useAuth } from "../../auth/AuthHook";
import PasswordStrengthBar from "react-password-strength-bar";

import { TextField } from "@material-ui/core";
import isEmail from "validator/lib/isEmail";
import { IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import SnackBar from "../UI/SnackBar";

function SignUp() {
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameHelper, setUsernameHelper] = useState(false);
  const [emailHelper, setEmailHelper] = useState(false);
  const [passwordHelper, setPasswordHelper] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  function snackBar(message, severity) {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    passwordError(password) && setPasswordHelper(true);
    !isEmail(email) && setEmailHelper(true);
    usernameError(username) && setUsernameHelper(true);

    if (
      !passwordError(password) &&
      isEmail(email) &&
      !usernameError(username)
    ) {
      firebase
        .firestore()
        .collection("usernames")
        .doc(username.toLowerCase())
        .get()
        .then((doc) => {
          if (doc.exists) {
            snackBar("Username taken, please choose another one", "error");
          } else {
            firebase
              .firestore()
              .collection("emails")
              .doc(email.toLowerCase())
              .get()
              .then((doc) => {
                if (doc.exists) {
                  snackBar("Email taken, please choose another one", "error");
                } else {
                  auth.signup(username, email, password);
                }
              });
          }
        });
    }
  }

  // Checks if the password is valid
  function passwordError(password) {
    return password.length < 8;
  }

  // Checks if the signup is valid

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameHelper(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value.toLowerCase());
    setEmailHelper(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordHelper(false);
  };

  const handleMouseDownPassword = () => {
    setShowPassword(!showPassword);
  };

  function usernameError(username) {
    if (username.length === 0 || username.length > 30) {
      return true;
    }
    return false;
  }

  function usernameHelperText(username) {
    if (username.length === 0) {
      return "Empty username is not allowed";
    } else if (username.length > 30) {
      return "Username length (30 characters) exceeded";
    }
    return "";
  }

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <Grid item xs={10}>
            <TextField
              aria-label="username text field"
              autoFocus={true}
              id="outlined-basic"
              label="Username"
              name="username"
              error={usernameHelper ? usernameError(username) : false}
              helperText={usernameHelper ? usernameHelperText(username) : ""}
              variant="outlined"
              onChange={(event) => handleUsernameChange(event)}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              aria-label="email text field"
              id="outlined-basic"
              label="Email"
              name="email"
              error={emailHelper ? !isEmail(email) : false}
              helperText={
                emailHelper && !isEmail(email) ? "Not a valid email" : ""
              }
              variant="outlined"
              onChange={(event) => handleEmailChange(event)}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth
              aria-label="password text field"
              id="outlined-basic"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              error={passwordHelper ? passwordError(password) : false}
              helperText={
                passwordHelper
                  ? passwordError(password)
                    ? "Password is too short"
                    : ""
                  : ""
              }
              variant="outlined"
              onChange={(event) => handlePasswordChange(event)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <PasswordStrengthBar
              password={password}
              minLength={8}
              style={{ marginTop: 20 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Sign up
            </Button>
          </Grid>
        </Grid>
      </form>
      <SnackBar
        open={open}
        message={message}
        setOpen={setOpen}
        severity={severity}
      />
    </>
  );
}

export default SignUp;
