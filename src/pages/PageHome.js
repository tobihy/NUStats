import React, { useState, useEffect } from "react";
import PollManager from "../component/Creator/PollManager";
import Previewer from "../component/Creator/Previewer";
import NavBar from "../component/NavBar";
import CompletedPolls from "../component/User/CompletedPolls";
import UncompletedPolls from "../component/User/UncompletedPolls";
import CreateIcon from "@material-ui/icons/Create";
import PollOutlinedIcon from "@material-ui/icons/PollOutlined";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
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
      console.log("polls retrieved");
      if (doc.exists) {
        setPolls(doc.data().polls);
      } else {
        setPolls([]);
      }
    });
  }, []);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const docRef = db.collection("userPolls").doc(uid);

    docRef.get().then((doc) => {
      console.log("userPolls retrieved");
      if (doc.exists) {
        setUserPolls(doc.data().userPolls);
      } else {
        setUserPolls([]);
      }
    });
  }, []);

  useEffect(() => {
    const db = firebase.firestore();
    const docRef = db.collection("submittedPolls").doc("globalId");

    docRef.get().then((doc) => {
      console.log("submittedPolls retrieved");
      if (doc.exists) {
        setSubmittedPolls(doc.data().submittedPolls);
      } else {
        setSubmittedPolls([]);
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
    const savedUserPolls = JSON.parse(window.localStorage.getItem("userPolls"));
    setUserPolls(savedUserPolls || []);
  }, []);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("polls")
      .doc(uid)
      .set({ polls: polls })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }, [polls]);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("submittedPolls")
      .doc("globalId")
      .set({ submittedPolls: submittedPolls })
      .then(() => {
        console.log("submittedPolls set!");
      })
      .catch((error) => {
        console.error("summittedPolls error: ", error);
      });
  }, [submittedPolls]);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("userPolls")
      .doc(uid)
      .set({ userPolls: userPolls })
      .then(() => {
        console.log("userPolls set!");
      })
      .catch((error) => {
        console.error("userPolls error: ", error);
      });
  }, [userPolls]);

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

  return (
    <BrowserRouter>
      <main>
        <NavBar toggleDrawer={toggleDrawer} />
        <div>
          <SwipeableDrawer anchor="left" open={drawer} onClose={toggleDrawer}>
            <List>
              {[
                "Poll Creator",
                "Poll Previewer",
                "Uncompleted Polls",
                "Completed Polls",
              ].map((text, index) => (
                <ListItem
                  key={text}
                  component={Link}
                  to={"/" + text.replace(/ /g, "")}
                  onClick={toggleDrawer}
                >
                  <ListItemIcon>
                    {index === 0 ? (
                      <CreateIcon />
                    ) : index === 1 ? (
                      <VisibilityIcon />
                    ) : index === 2 ? (
                      <PollOutlinedIcon />
                    ) : (
                      <AssignmentTurnedInOutlinedIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </SwipeableDrawer>
        </div>

        <Switch>
          <Route
            exact
            path="/"
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
