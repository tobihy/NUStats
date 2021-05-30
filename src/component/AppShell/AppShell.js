import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";

import { useAuth } from "../../hooks/AuthHook";

import styles from "./AppShell.module.css";

function AppShell() {
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

  return user !== null ? (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className="AppShell">
          NUStats
        </Typography>
        <Avatar
          className={styles.clickable}
          alt={user.displayName}
          src={user.photoURL}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
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

export default AppShell;
