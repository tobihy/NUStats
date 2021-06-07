import React, { useState, useEffect } from "react";
import PollManager from "../component/Creator/PollManager";
import Previewer from "../component/Creator/Previewer";
import NavBar from "../component/NavBar";
import CompletedPolls from "../component/User/CompletedPolls";
import UncompletedPolls from "../component/User/UncompletedPolls";
import Dashboard from "../component/Dashboard";
import HomeIcon from "@material-ui/icons/Home";
import CreateIcon from "@material-ui/icons/Create";
import PollOutlinedIcon from "@material-ui/icons/PollOutlined";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import { Divider } from "@material-ui/core";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@material-ui/core";

import {
  // eslint-disable-next-line
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import firebase from "../auth/AuthHook";

function PageHome() {
  const [polls, setPolls] = useState([]);
  const [submittedPolls, setSubmittedPolls] = useState([]);
  const [userPolls, setUserPolls] = useState([]);
  const [drawer, setDrawer] = useState(false);

  function toggleDrawer() {
    setDrawer(!drawer);
  }

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const pollsRef = db.collection("polls").doc(uid);
    const userPollsRef = db.collection("userPolls").doc(uid);
    const submittedPollsRef = db.collection("submittedPolls").doc("globalId");

    var sp = [];
    var up = [];

    pollsRef.get().then((doc) => {
      if (doc.exists) {
        console.log(
          "polls retrieved" + JSON.stringify(doc.data().polls || []) + " done"
        );
        setPolls(doc.data().polls || []);
      }
    });

    userPollsRef.get().then((doc) => {
      if (doc.exists) {
        up = doc.data().userPolls || [];
        console.log("userPolls retrieved" + JSON.stringify(up) + " done");
        setUserPolls(up);
      }
    });

    submittedPollsRef.get().then((doc) => {
      if (doc.exists) {
        sp = doc.data().submittedPolls || [];
        console.log("submittedPolls retrieved" + JSON.stringify(sp) + " done");
        setSubmittedPolls(sp);
      }
    });
    // .then(() => refreshUserPoll(up, sp));
    //eslint-disable-next-line
  }, []);

  const updatePoll = (p) => {
    setPolls(p);
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("polls")
      .doc(uid)
      .set({ polls: p })
      .then(() => {
        console.log("(creator) polls set!" + JSON.stringify(p));
      })
      .catch((error) => {
        console.error("(creator) polls: error", error);
      });
  };

  const updateSubmittedPoll = (p) => {
    setSubmittedPolls(p);
    const db = firebase.firestore();
    db.collection("submittedPolls")
      .doc("globalId")
      .set({ submittedPolls: p })
      .then(() => {
        console.log("submittedPolls set!: " + JSON.stringify(p));
      })
      .catch((error) => {
        console.error("summittedPolls error: ", error);
      });
  };

  const updateUserPoll = (p) => {
    setUserPolls(p);
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("userPolls")
      .doc(uid)
      .set({ userPolls: p })
      .then(() => {
        console.log("userPolls set!: " + JSON.stringify(p));
      })
      .catch((error) => {
        console.error("userPolls error: ", error);
      });
  };

  // List objects
  const home = { id: "Dashboard", icon: <HomeIcon /> };
  const pollCreator = { id: "Poll Creator", icon: <CreateIcon /> };
  const pollPreviewer = { id: "Poll Previewer", icon: <VisibilityIcon /> };
  const uncompletedPolls = {
    id: "Uncompleted Polls",
    icon: <PollOutlinedIcon />,
  };
  const completedPolls = {
    id: "Completed Polls",
    icon: <AssignmentTurnedInOutlinedIcon />,
  };

  const menuItems = [
    home,
    pollCreator,
    pollPreviewer,
    uncompletedPolls,
    completedPolls,
  ];

  return (
    <BrowserRouter>
      <main>
        <NavBar toggleDrawer={toggleDrawer} />
        <div>
          <SwipeableDrawer
            anchor="left"
            open={drawer}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}
          >
            <List style={{ width: "275px" }}>
              {menuItems.map((mItem) => (
                <div key={mItem.id}>
                  <ListItem
                    component={Link}
                    to={"/" + mItem.id.replace(/ /g, "")}
                    onClick={toggleDrawer}
                  >
                    <ListItemIcon>{mItem.icon}</ListItemIcon>
                    <ListItemText
                      primary={mItem.id}
                      style={{ color: "#2c387e" }}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </SwipeableDrawer>
        </div>

        <Switch>
          <Route
            exact
            path="/"
            render={() => <Dashboard submittedPolls={submittedPolls} />}
          />
          <Route
            exact
            path="/Dashboard"
            render={() => <Dashboard submittedPolls={submittedPolls} />}
          />
          <Route
            path="/PollCreator"
            render={() => (
              <PollManager
                polls={polls}
                updatePoll={updatePoll}
                submittedPolls={submittedPolls}
                updateSubmittedPoll={updateSubmittedPoll}
              />
            )}
          />
          <Route
            path="/PollPreviewer"
            render={() => <Previewer polls={polls} />}
          />
          <Route
            path="/UncompletedPolls"
            render={() => (
              <UncompletedPolls
                submittedPolls={submittedPolls}
                updateSubmittedPoll={updateSubmittedPoll}
                userPolls={userPolls}
                updateUserPoll={updateUserPoll}
              />
            )}
          />
          <Route
            path="/CompletedPolls"
            render={() => (
              <CompletedPolls
                submittedPolls={submittedPolls}
                updateSubmittedPoll={updateSubmittedPoll}
                userPolls={userPolls}
                updateUserPoll={updateUserPoll}
              />
            )}
          />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default PageHome;
