import React, { useEffect, useState } from "react";
import firebase from "../../../auth/AuthHook";
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
// eslint-disable-next-line
import { BrowserRouter as Switch, Route, Link } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    const usersRef = db.collection("userInfo").orderBy("username", "asc");

    usersRef.get().then((querySnapshot) => {
      const tempDocs = [];
      querySnapshot.forEach((userRef) => {
        const { username, profilepic, total } = userRef.data();
        tempDocs.push({
          uid: userRef.id,
          username: username,
          profilepic: profilepic,
          total: total,
        });
      });

      setUsers(tempDocs);
    });
  }, []);

  function UserRectangle(props) {
    const [picUrl, setPicUrl] = useState("");

    useEffect(() => {
      if (props.user.profilepic !== false) {
        setPicUrl(props.user.profilepic);
      }
    }, [props]);

    return (
      <ListItem button component={Link} to={"/Users/" + props.user.uid}>
        <ListItemIcon>
          {picUrl === "" ? (
            <Avatar>
              <PersonIcon />
            </Avatar>
          ) : (
            <Avatar src={picUrl} alt={props.user.username} />
          )}
        </ListItemIcon>
        <ListItemText primary={props.user.username} />
      </ListItem>
    );
  }

  return (
    <>
      <Typography variant="h5" align="center">
        Users
      </Typography>

      <List>
        {users.map((user) => (
          <UserRectangle key={user.uid} user={user} />
        ))}
      </List>
    </>
  );
}

export default Users;
