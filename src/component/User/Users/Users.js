import React, { useEffect, useState } from "react";
import ProfilePage from "../Parts/ProfilePage";
import firebase from "../../../auth/AuthHook";
import { Avatar } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { BrowserRouter as Switch, Route, Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

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

  function allUsers() {
    return (
      <List>
        {users.map((user) => (
          <UserRectangle key={user.uid} user={user} />
        ))}
      </List>
    );
  }

  return (
    <Switch>
      <Route exact path="/Users">
        {allUsers()}
      </Route>
      <Route exact path="/Users/:userId">
        <ProfilePage />
      </Route>
    </Switch>
  );
}

export default Users;
