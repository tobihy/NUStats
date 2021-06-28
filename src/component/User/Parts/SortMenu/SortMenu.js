import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const options = [
  "Latest",
  "Oldest",
  "Highest Poll Count",
  "Lowest Poll Count",
  "A to Z",
  "Z to A",
];

export default function SortMenu(props) {
  const { selectedIndex, setSelectedIndex } = props;
  const [anchorEl, setAnchorEl] = useState();

  const handleClickListItem = (event) => {
    event.preventDefault();

    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    event.preventDefault();

    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = (event) => {
    event.preventDefault();

    setAnchorEl(null);
  };

  return (
    <div>
      <List component="nav">
        <ListItem button onClick={handleClickListItem}>
          <ListItemText primary="Sort via" secondary={options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
