import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";
import isEmail from "validator/lib/isEmail";

import "firebase/auth";
import { useAuth } from "../../auth/AuthHook";

import { TextField } from "@material-ui/core";
import SnackBar from "../UI/SnackBar";

function SignIn() {
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setOpen(true);
    setEmailSent(true);
    auth.sendEmailLink(email);
  }

  const handleEmailChange = (event) => {
    event.preventDefault();
    setEmail(event.target.value.toLowerCase());
  };

  return (
    <>
      {emailSent ? (
        <p>
          The login link has been sent to your email address. Click on the link
          to log in!
        </p>
      ) : (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
          >
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
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isEmail(email)}
              >
                Sign in
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
      <SnackBar
        open={open}
        message="Email login link sent!"
        setOpen={setOpen}
        severity="success"
      />
    </>
  );
}

export default SignIn;
