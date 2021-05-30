import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { ReactComponent as ReactLogo } from "../../graphics/logo.svg";
import styles from "./NavBar.module.css";
import { useAuth } from "../../hooks/AuthHook";

function NavBar(props) {
  const { toggleDrawer } = props;

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
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <ReactLogo className={styles.logo} />
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
    </div>
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
