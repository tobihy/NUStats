//eslint-disable-next-line
import styles from "./styles.css";
import React, { useState, useEffect } from "react";
import firebase, { useAuth, ProvideAuth } from "./auth/AuthHook";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import PageLogin from "./pages/PageLogin";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import deepPurple from "@material-ui/core/colors/deepPurple";
import pink from "@material-ui/core/colors/pink";
import grey from "@material-ui/core/colors/grey";
import PollManager from "./component/Creator/PollManager";
import NavBar, { BottomNav } from "./component/NavBar";
import MySubmittedPolls from "./component/User/MySubmittedPolls";
import Polls from "./component/User/Polls";
import Dashboard from "./component/Dashboard";
import Settings from "./component/Settings";
import Users from "./component/User/Users";
import { Container } from "@material-ui/core";
import ProfilePage from "./component/User/Parts/ProfilePage";

function AppBody() {
  const auth = useAuth();
  const user = auth.user;
  const [avatarURL, setAvatarURL] = useState("");
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState(true);

  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    var email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    }
    auth.passwordlessSignIn(email, window.location.href);
  }

  useEffect(() => {
    if (user !== null) {
      const uid = firebase.auth().currentUser?.uid;
      const userRef = firebase
        .firestore()
        .collection("userInfo")
        .doc(uid)
        .get();
      userRef.then((doc) => {
        if (doc.exists) {
          setUsername(doc.data().username);
          if (doc.data().profilepic !== undefined) {
            setAvatarURL(doc.data().profilepic);
          }
        }
      });
    }
  }, [user]);

  const dark = createMuiTheme({
    typography: {
      fontSize: 14,
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
      <NavBar avatarURL={avatarURL} setTheme={setTheme} theme={theme} />
      <Container
        maxWidth="md"
        style={{ paddingTop: "2.5rem", paddingBottom: "5.5rem" }}
      >
        {user ? (
          <Redirect to={{ pathname: "/Home" }} />
        ) : (
          <Redirect to={{ pathname: "/Login" }} />
        )}

        <Switch>
          <Route path="/Login" render={() => <PageLogin />} />

          <Switch>
            <Route exact path="/" render={() => <Dashboard />} />
            <Route exact path="/Home" render={() => <Dashboard />} />
            <Route exact path="/Drafts" render={() => <PollManager />} />
            <Route exact path="/Profile" render={() => <MySubmittedPolls />} />
            <Route exact path="/Polls" render={() => <Polls />} />
            <Route
              path="/Settings"
              render={() => (
                <Settings
                  avatarURL={avatarURL}
                  setAvatarURL={setAvatarURL}
                  username={username}
                  setUsername={setUsername}
                />
              )}
            />
            <Route exact path="/Users" render={() => <Users />} />
            <Route exact path="/Users/:userId" render={() => <ProfilePage />} />
            <Route exact path="/Users/:userId/:type" render={() => <Users />} />
            <Route exact path="/Profile/:type" render={() => <Users />} />
          </Switch>
        </Switch>
      </Container>
      <BottomNav />
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
