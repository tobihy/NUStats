import React from "react";
import PollManager from "../component/Creator/PollManager";
import NavBar from "../component/NavBar";
import MySubmittedPolls from "../component/User/MySubmittedPolls";
import Polls from "../component/User/Polls";
import Dashboard from "../component/Dashboard";
import Settings from "../component/Settings";
import Users from "../component/User/Users";
import { Container } from "@material-ui/core";
import styles from "./PageHome.module.css";
import ProfilePage from "../component/User/Parts/ProfilePage";

import {
  // eslint-disable-next-line
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";

function PageHome() {
  return (
    <BrowserRouter>
      <main>
        <NavBar />
        <Container maxWidth="md" className={styles.container}>
          <Switch>
            <Route exact path="/" render={() => <Dashboard />} />
            <Route exact path="/Dashboard" render={() => <Dashboard />} />
            <Route path="/PollCreator" render={() => <PollManager />} />
            <Route
              path="/MySubmittedPolls"
              render={() => <MySubmittedPolls />}
            />
            <Route path="/Polls" render={() => <Polls />} />
            <Route path="/Settings" render={() => <Settings />} />
            <Route exact path="/Users" render={() => <Users />} />
            <Route
              exact
              path="/Users/:userId"
              render={() => <ProfilePage />}
            ></Route>
          </Switch>
        </Container>
      </main>
    </BrowserRouter>
  );
}

export default PageHome;
