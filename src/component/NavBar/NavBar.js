import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Zoom,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { ReactComponent as ReactLogo } from "../../graphics/logo.svg";
import styles from "./NavBar.module.css";
import { useAuth } from "../../auth/AuthHook";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import CreateIcon from "@material-ui/icons/Create";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import CloudDoneOutlinedIcon from "@material-ui/icons/CloudDoneOutlined";
import PersonIcon from "@material-ui/icons/Person";

function NavBar() {
  const auth = useAuth();
  const user = auth.user;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    auth.signout();
  };

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
  const polls = {
    id: "Polls",
    icon: <AssignmentTurnedInOutlinedIcon />,
  };
  const users = {
    id: "Users",
    icon: <PersonIcon />,
  };

  const menuItems = [home, pollCreator, mySubmittedPolls, polls, users];

  return user !== null ? (
    <>
      <AppBar position="static">
        <Toolbar>
          <Tooltip TransitionComponent={Zoom} title="Navigation" arrow>
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} title="Dashboard" arrow>
            <Link to="/Dashboard" className={styles.logo}>
              <ReactLogo className={styles.logo} />
            </Link>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} title="Account" arrow>
            <Avatar
              className={styles.clickable}
              alt={user.displayName}
              src={user.photoURL}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            />
          </Tooltip>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to={"/Settings"} onClick={handleClose}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
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
                <ListItemText primary={mItem.id} style={{ color: "#2c387e" }} />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </SwipeableDrawer>
    </>
  ) : (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className="AppShell">
          NUStats
        </Typography>{" "}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
