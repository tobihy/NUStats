import React, { useState, useEffect } from "react";
import PollManager from "../component/Creator/PollManager";
import Previewer from "../component/Creator/Previewer";
import NavBar from "../component/NavBar";
import CompletedPolls from "../component/User/CompletedPolls";
import UncompletedPolls from "../component/User/UncompletedPolls";
import MySubmittedPolls from "../component/User/MySubmittedPolls";
import Dashboard from "../component/Dashboard";
import HomeIcon from "@material-ui/icons/Home";
import CreateIcon from "@material-ui/icons/Create";
import PollOutlinedIcon from "@material-ui/icons/PollOutlined";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import CloudDoneOutlinedIcon from "@material-ui/icons/CloudDoneOutlined";
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
  const [myCompletedPolls, setMyCompletedPolls] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const location = window.location.pathname;

  function toggleDrawer() {
    setDrawer(!drawer);
  }

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const pollsRef = db.collection("users").doc(uid).collection("draftPolls");
    const submittedPollsRef = db.collection("draftSubmittedPolls");

    pollsRef
      .orderBy("updated", "desc")
      .get()
      .then((querySnapshot) => {
        const tempDocs = [];
        querySnapshot.forEach((doc) => {
          tempDocs.push({ id: doc.id, ...doc.data() });
        });
        console.log("polls retrieved" + JSON.stringify(tempDocs) + " done");
        setPolls(tempDocs);
      });

    submittedPollsRef
      .orderBy("submissionTime", "desc")
      .get()
      .then((querySnapshot) => {
        const tempDocs = [];
        querySnapshot.forEach((pollRef) => {
          tempDocs.push({
            id: pollRef.id,
            ...pollRef.data(),
          });
        });
        console.log(
          "submittedPolls retrieved" + JSON.stringify(tempDocs) + " done"
        );
        setSubmittedPolls(tempDocs);
      });
  }, [location]);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const responsesRef = db.collection("responses");
    const submittedPollsRef = db.collection("draftSubmittedPolls");
    const tempDocs = [];
    responsesRef
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((pollRef) => {
          const response = {
            ...pollRef.data(),
          };
          // console.log("response", response);
          submittedPollsRef
            .doc(response.pollId)
            .get()
            .then((pollSnapshot) => {
              var poll = pollSnapshot.data();
              // console.log("poll", poll);
              // console.log("toPush", { ...poll, ...response });
              tempDocs.push({ ...poll, ...response });
            });
          console.log(
            "completedPolls retrieved" + JSON.stringify(tempDocs) + " done"
          );
          setMyCompletedPolls(tempDocs);
        });
      });
  }, [location]);

  // List objects
  const home = { id: "Dashboard", icon: <HomeIcon /> };
  const pollCreator = { id: "Poll Creator", icon: <CreateIcon /> };
  const pollPreviewer = { id: "Poll Previewer", icon: <VisibilityIcon /> };
  const mySubmittedPolls = {
    id: "My Submitted Polls",
    icon: <CloudDoneOutlinedIcon />,
  };
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
    mySubmittedPolls,
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
                setPolls={setPolls}
                submittedPolls={submittedPolls}
              />
            )}
          />
          <Route path="/MySubmittedPolls" render={() => <MySubmittedPolls />} />
          <Route
            path="/PollPreviewer"
            render={() => <Previewer polls={polls} />}
          />
          <Route
            path="/UncompletedPolls"
            render={() => <UncompletedPolls submittedPolls={submittedPolls} />}
          />
          <Route
            path="/CompletedPolls"
            render={() => <CompletedPolls completedPolls={myCompletedPolls} />}
          />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default PageHome;
