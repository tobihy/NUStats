import React, { useEffect, useState } from "react";
import PollManager from "../component/Creator/PollManager";
import NavBar, { BottomNav } from "../component/NavBar";
import MySubmittedPolls from "../component/User/MySubmittedPolls";
import Polls from "../component/User/Polls";
import Dashboard from "../component/Dashboard";
import Settings from "../component/Settings";
import Users from "../component/User/Users";
import { Container } from "@material-ui/core";
import styles from "./PageHome.module.css";
import firebase, { useAuth } from "../auth/AuthHook";
import ProfilePage from "../component/User/Parts/ProfilePage";

import {
  // eslint-disable-next-line
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";

function PageHome(props) {
  const [avatarURL, setAvatarURL] = useState("");
  const [username, setUsername] = useState("");
  const auth = useAuth();
  const user = auth.user;

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

  return (
    <BrowserRouter>
      <main>
        <NavBar
          avatarURL={avatarURL}
          setTheme={props.setTheme}
          theme={props.theme}
        />
        <Container maxWidth="md" className={styles.container}>
          <Switch>
            <Route exact path="/" render={() => <Dashboard />} />
            <Route exact path="/Home" render={() => <Dashboard />} />
            <Route path="/Drafts" render={() => <PollManager />} />
            <Route path="/Profile" render={() => <MySubmittedPolls />} />
            <Route path="/Polls" render={() => <Polls />} />
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
          </Switch>
        </Container>
        <BottomNav />
      </main>
    </BrowserRouter>
  );
}

export default PageHome;
