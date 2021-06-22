<<<<<<< HEAD
import React from "react";
=======
import React, { useState } from "react";
>>>>>>> 93efff648338c14e63e0520c8a02d8cd71c76598
import PollManager from "../component/Creator/PollManager";
import NavBar from "../component/NavBar";
import MySubmittedPolls from "../component/User/MySubmittedPolls";
import Polls from "../component/User/Polls";
import Dashboard from "../component/Dashboard";
import Settings from "../component/Settings";
import Users from "../component/User/Users";

import {
  // eslint-disable-next-line
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";

function PageHome() {
<<<<<<< HEAD
=======
  const [drawer, setDrawer] = useState(false);

  function toggleDrawer() {
    setDrawer(!drawer);
  }

  // List objects
  const home = { id: "Dashboard", icon: <HomeIcon /> };
  const pollCreator = { id: "Poll Creator", icon: <CreateIcon /> };
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
    mySubmittedPolls,
    uncompletedPolls,
    completedPolls,
  ];

>>>>>>> 93efff648338c14e63e0520c8a02d8cd71c76598
  return (
    <BrowserRouter>
      <main>
        <NavBar />
        <Switch>
          <Route exact path="/" render={() => <Dashboard />} />
          <Route exact path="/Dashboard" render={() => <Dashboard />} />
          <Route path="/PollCreator" render={() => <PollManager />} />
          <Route path="/MySubmittedPolls" render={() => <MySubmittedPolls />} />
<<<<<<< HEAD
          <Route path="/Polls" render={() => <Polls />} />
          <Route path="/Settings" render={() => <Settings />} />
          <Route exact path="/Users" render={() => <Users />} />
=======
          <Route path="/UncompletedPolls" render={() => <UncompletedPolls />} />
          <Route path="/CompletedPolls" render={() => <CompletedPolls />} />
>>>>>>> 93efff648338c14e63e0520c8a02d8cd71c76598
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default PageHome;
