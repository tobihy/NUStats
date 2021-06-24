import React, { useEffect, useState } from "react";
import { Button, Grid, InputAdornment } from "@material-ui/core";

import "firebase/auth";
import firebase from "../../auth/AuthHook";
import { useAuth } from "../../auth/AuthHook";
import PasswordStrengthBar from "react-password-strength-bar";

import { TextField } from "@material-ui/core";
import isEmail from "validator/lib/isEmail";
import { IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

function SignUp() {
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [usernameInUse, setUsernameInUse] = useState(false);
  const [emailInUse, setEmailInUse] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [signupValid, setSignupValid] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    auth.signup(username, email, password);
  }

  // Checks if username is already in use
  useEffect(() => {
    if (username.length === 0) {
      setUsernameInUse(false);
    } else {
      firebase
        .firestore()
        .collection("usernames")
        .doc(username.toLowerCase())
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUsernameInUse(true);
          } else {
            setUsernameInUse(false);
          }
        });
    }
  }, [username]);

  // Checks if email is already in use
  useEffect(() => {
    if (email.length === 0) {
      setEmailInUse(false);
    } else {
      firebase
        .firestore()
        .collection("emails")
        .doc(email.toLowerCase())
        .get()
        .then((doc) => {
          if (doc.exists) {
            setEmailInUse(true);
          } else {
            setEmailInUse(false);
          }
        });
    }
  }, [email]);

  // Checks if the password is valid
  useEffect(() => {
    if (password.length >= 8) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  }, [password]);

  // Checks if the signup is valid
  useEffect(() => {
    if (username.length !== 0 && isEmail(email) && password.length !== 0) {
      setSignupValid(!usernameInUse && !emailInUse && passwordValid);
    } else {
      setSignupValid(false);
    }
  }, [username, email, password, usernameInUse, emailInUse, passwordValid]);

  const handleUsernameChange = (event) => {
    // event.preventDefault();
    setUsername(event.target.value);
    console.log("Username " + event.target.value + " is set!");
  };

  const handleEmailChange = (event) => {
    // event.preventDefault();
    setEmail(event.target.value.toLowerCase());
    console.log("Email " + event.target.value + " is set!");
  };

  const handlePasswordChange = (event) => {
    // event.preventDefault();
    setPassword(event.target.value);
    console.log("Password " + event.target.value + " is set!");
  };

  const handleMouseDownPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
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
            error={usernameInUse}
            helperText={usernameInUse ? "Username in use" : " "}
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
            error={emailInUse}
            helperText={emailInUse ? "Email in use" : " "}
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!signupValid}
          >
            Sign up
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default SignUp;
