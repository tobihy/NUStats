import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";

import "firebase/auth";
import { useAuth } from "../../auth/AuthHook";

import { TextField } from "@material-ui/core";

function SignIn() {
  const auth = useAuth();

  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    return auth.signin(email, password);
  }

  // const handleUsernameChange = (event) => {
  //   event.preventDefault();
  //   setUsername(event.target.value.toLowerCase());
  //
  // };

  const handleEmailChange = (event) => {
    event.preventDefault();
    setEmail(event.target.value.toLowerCase());
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        {/* <Grid item xs={12}>
          <TextField
            aria-label="username text field"
            autoFocus={true}
            id="outlined-basic"
            label="Username"
            name="username"
            variant="outlined"
            onChange={(event) => handleUsernameChange(event)}
          />
        </Grid> */}
        <Grid item xs={12}>
          <TextField
            aria-label="email text field"
            id="email"
            label="Email"
            name="email"
            variant="outlined"
            onChange={(event) => handleEmailChange(event)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            aria-label="password text field"
            id="password"
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            onChange={(event) => handlePasswordChange(event)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Sign in
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default SignIn;
