import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Zoom,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { ReactComponent as ReactLogo } from "../../graphics/logo.svg";
import styles from "./NavBar.module.css";
import { useAuth } from "../../auth/AuthHook";
import { Link } from "react-router-dom";

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

export default NavBar;
