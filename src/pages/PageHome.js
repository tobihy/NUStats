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
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";

function PageHome() {
  const [polls, setPolls] = useState([]);
  const [submittedPolls, setSubmittedPolls] = useState([]);
  const [userPolls, setUserPolls] = useState([]);
  const [drawer, setDrawer] = useState(false);

  function toggleDrawer() {
    setDrawer(!drawer);
  }

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
    window.localStorage.setItem("polls", JSON.stringify(newPolls));
  }

  useEffect(() => {
    const savedPolls = JSON.parse(window.localStorage.getItem("polls"));
    const savedSubmittedPolls = JSON.parse(
      window.localStorage.getItem("submittedPolls")
    );
    const savedUserPolls = JSON.parse(window.localStorage.getItem("userPolls"));
    setPolls(savedPolls || []);
    setSubmittedPolls(savedSubmittedPolls || []);
    setUserPolls(savedUserPolls || []);
  }, []);

  useEffect(() => {
    const savedSubmittedPolls = JSON.parse(
      window.localStorage.getItem("submittedPolls")
    );
    const savedUserPolls = JSON.parse(window.localStorage.getItem("userPolls"));
    const delta =
      savedSubmittedPolls &&
      savedSubmittedPolls.slice(
        savedUserPolls === null ? 0 : savedUserPolls.length
      );
    delta &&
      delta.forEach((i) => {
        i.completed = false;
        i.responses = -1;
      });
    const newUserPolls =
      delta === null
        ? []
        : savedUserPolls === null
        ? [...delta]
        : [...savedUserPolls, ...delta];
    setUserPolls(newUserPolls || savedUserPolls);
    window.localStorage.setItem("userPolls", JSON.stringify(newUserPolls));
  }, []);

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
