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
  //eslint-disable-next-line
  const [view, setView] = useState("");

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
      console.log("allUsersReceived" + JSON.stringify(tempDocs) + " done");
      setUsers(tempDocs);
    });
  }, []);

  function UserRectangle(props) {
    const [picUrl, setPicUrl] = useState("");

    useEffect(() => {
      props.user.profilepic &&
        firebase
          .storage()
          .ref("profilepics")
          .child(props.user.uid + "_200x200.jpeg")
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setPicUrl(url);
          });
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
