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
  Tooltip,
  Zoom,
  Hidden,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { ReactComponent as ReactLogo } from "../../graphics/logo.svg";
import styles from "./NavBar.module.css";
import { useAuth } from "../../auth/AuthHook";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import CreateIcon from "@material-ui/icons/Create";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonIcon from "@material-ui/icons/Person";
import PeopleIcon from "@material-ui/icons/People";

// List objects
const home = { id: "Home", icon: <HomeIcon /> };
const pollCreator = { id: "Drafts", icon: <CreateIcon /> };
const profile = {
  id: "Profile",
  icon: <PersonIcon />,
};
const polls = {
  id: "Polls",
  icon: <AssignmentIcon />,
};
const users = {
  id: "Users",
  icon: <PeopleIcon />,
};

const menuItems = [home, pollCreator, polls, users, profile];

export function BottomNav() {
  const location = useLocation().pathname.split("/")[1];
  const auth = useAuth();
  const user = auth.user;
  return user !== null ? (
    <Hidden smUp>
      <BottomNavigation showLabels className={styles.bottom} value={location}>
        {menuItems.map((mItem) => (
          <BottomNavigationAction
            key={mItem.id}
            component={Link}
            to={"/" + mItem.id.replace(/ /g, "")}
            label={mItem.id}
            icon={mItem.icon}
            value={mItem.id.replace(/ /g, "")}
          />
        ))}
      </BottomNavigation>
    </Hidden>
  ) : null;
}

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

  const location = useLocation().pathname.split("/")[1];

  return user !== null ? (
    <>
      <AppBar position="static">
        <Toolbar>
          <Hidden xsDown>
            <Tooltip TransitionComponent={Zoom} title="Navigation" arrow>
              <IconButton color="inherit" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </Hidden>
          <Tooltip TransitionComponent={Zoom} title="Home" arrow>
            <Link to="/Home" className={styles.logo}>
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
        <List style={{ width: "275px", padding: 0 }}>
          {menuItems.map((mItem) => (
            <ListItem
              button
              key={mItem.id}
              component={Link}
              to={"/" + mItem.id.replace(/ /g, "")}
              onClick={toggleDrawer}
              selected={location === mItem.id.replace(/ /g, "")}
            >
              <ListItemIcon>{mItem.icon}</ListItemIcon>
              <ListItemText primary={mItem.id} />
            </ListItem>
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
