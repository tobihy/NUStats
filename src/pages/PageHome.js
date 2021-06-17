import React, { useState } from "react";
import PollManager from "../component/Creator/PollManager";
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

function PageHome() {
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
          <Route exact path="/" render={() => <Dashboard />} />
          <Route exact path="/Dashboard" render={() => <Dashboard />} />
          <Route path="/PollCreator" render={() => <PollManager />} />
          <Route path="/MySubmittedPolls" render={() => <MySubmittedPolls />} />
          <Route path="/UncompletedPolls" render={() => <UncompletedPolls />} />
          <Route path="/CompletedPolls" render={() => <CompletedPolls />} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default PageHome;
