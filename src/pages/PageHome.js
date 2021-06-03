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
import { firebase } from "@firebase/app";

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
    const docRef = db.collection("polls").doc(uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log(
          "polls retrieved" + JSON.stringify(doc.data().polls) + " done"
        );
        setPolls(doc.data().polls);
      }
    });
  }, []);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const docRef = db.collection("userPolls").doc(uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log(
          "userPolls retrieved" + JSON.stringify(doc.data().userPolls) + " done"
        );
        setUserPolls(doc.data().userPolls);
      }
    });
  }, []);

  useEffect(() => {
    const db = firebase.firestore();
    const docRef = db.collection("submittedPolls").doc("globalId");

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log(
          "submittedPolls retrieved" +
            JSON.stringify(doc.data().submittedPolls) +
            " done"
        );
        setSubmittedPolls(doc.data().submittedPolls);
      }
    });
  }, []);

  function editPoll(description, options, pollId) {
    const newPolls = [
      ...polls.slice(0, pollId),
      {
        id: pollId,
        description: description,
        options: options,
      },
      ...polls.slice(pollId + 1),
    ];
    setPolls(newPolls);
  }

  useEffect(() => {
    //const cspoll = submittedPolls;
    //console.log("last" + JSON.stringify(cspoll));
    //console.log("outside submittedPolls set!: " + JSON.stringify(cspoll));
    const db = firebase.firestore();
    db.collection("submittedPolls")
      .doc("globalId")
      .set({ submittedPolls: submittedPolls })
      .then(() => {
        console.log("submittedPolls set!: " + JSON.stringify(submittedPolls));
      })
      .catch((error) => {
        console.error("summittedPolls error: ", error);
      });
  }, [submittedPolls]);

  useEffect(() => {
    //const cupoll = userPolls;
    //console.log("last" + JSON.stringify(cupoll));
    //console.log("outside userPolls set!: " + JSON.stringify(cupoll));
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("userPolls")
      .doc(uid)
      .set({ userPolls: userPolls })
      .then(() => {
        console.log("userPolls set!: " + JSON.stringify(userPolls));
      })
      .catch((error) => {
        console.error("userPolls error: ", error);
      });
  }, [userPolls]);

  useEffect(() => {
    //const cpoll = polls;
    //console.log("last" + JSON.stringify(cpoll));
    //console.log("outside (creator) polls set!" + JSON.stringify(cpoll));
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    if (polls !== []) {
      db.collection("polls")
        .doc(uid)
        .set({ polls: polls })
        .then(() => {
          console.log("(creator) polls set!" + JSON.stringify(polls));
        })
        .catch((error) => {
          console.error("(creator) polls: error", error);
        });
    }
  }, [polls]);

  useEffect(() => {
    const delta =
      submittedPolls &&
      submittedPolls.slice(userPolls === null ? 0 : userPolls.length);
    delta &&
      delta.forEach((i) => {
        i.completed = false;
        i.responses = [];
      });
    const newUserPolls =
      delta === null
        ? []
        : userPolls === null
        ? [...delta]
        : [...userPolls, ...delta];
    setUserPolls(newUserPolls || userPolls);
    // eslint-disable-next-line
  }, [submittedPolls]);

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
            render={() => (
              <Dashboard
                polls={polls}
                setPolls={setPolls}
                editPoll={editPoll}
                submittedPolls={submittedPolls}
                setSubmittedPolls={setSubmittedPolls}
              />
            )}
          />
          <Route
            exact
            path="/Dashboard"
            render={() => (
              <Dashboard
                polls={polls}
                setPolls={setPolls}
                editPoll={editPoll}
                submittedPolls={submittedPolls}
                setSubmittedPolls={setSubmittedPolls}
              />
            )}
          />
          <Route
            path="/PollCreator"
            render={() => (
              <PollManager
                polls={polls}
                setPolls={setPolls}
                editPoll={editPoll}
                submittedPolls={submittedPolls}
                setSubmittedPolls={setSubmittedPolls}
              />
            )}
          />
          <Route
            path="/PollPreviewer"
            render={() => <Previewer polls={polls} editPoll={editPoll} />}
          />
          <Route
            path="/UncompletedPolls"
            render={() => (
              <UncompletedPolls
                polls={polls}
                setPolls={setPolls}
                editPoll={editPoll}
                submittedPolls={submittedPolls}
                setSubmittedPolls={setSubmittedPolls}
                userPolls={userPolls}
                setUserPolls={setUserPolls}
              />
            )}
          />
          <Route
            path="/CompletedPolls"
            render={() => (
              <CompletedPolls
                polls={polls}
                setPolls={setPolls}
                editPoll={editPoll}
                submittedPolls={submittedPolls}
                setSubmittedPolls={setSubmittedPolls}
                userPolls={userPolls}
                setUserPolls={setUserPolls}
              />
            )}
          />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default PageHome;
