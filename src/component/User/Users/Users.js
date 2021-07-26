import React, { useEffect, useState } from "react";
import firebase from "../../../auth/AuthHook";
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
/* eslint-disable */
import {
  useParams,
  BrowserRouter as Switch,
  Route,
  Link,
} from "react-router-dom";
/* eslint-enable */

function Users() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const { type, userId } = useParams();

  const useStyles = makeStyles((theme) => ({
    sizeAvatar: {
      height: theme.spacing(15),
      width: theme.spacing(15),
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: "1rem",
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    const db = firebase.firestore().collection("userInfo");
    var usersRef;

    if (type === undefined) {
      usersRef = db.orderBy("username", "asc");
    } else {
      if (type === "Followers") {
        usersRef = db.where(
          "followings",
          "array-contains",
          userId || firebase.auth().currentUser?.uid
        );
      } else {
        usersRef = db.where(
          "followers",
          "array-contains",
          userId || firebase.auth().currentUser?.uid
        );
      }
    }

    usersRef.get().then((querySnapshot) => {
      const tempDocs = [];
      querySnapshot.forEach((userRef) => {
        const { username, profilepic, total } = userRef.data();
        const data = {
          uid: userRef.id,
          username: username,
          profilepic: profilepic,
          total: total,
        };
        console.log("data", data);
        tempDocs.push(data);
      });

      setUsers(tempDocs);
    });

    if (type !== undefined) {
      firebase
        .firestore()
        .collection("userInfo")
        .doc(userId || firebase.auth().currentUser?.uid)
        .get()
        .then((snapshot) => setUser(snapshot.data()));
    }
  }, [type, userId]);

  function title() {
    if (type === undefined) {
      return (
        <Typography variant="h5" align="center">
          Users
        </Typography>
      );
    } else {
      return (
        <>
          <Avatar
            alt={user.username}
            src={user.profilepic}
            className={classes.sizeAvatar}
          />
          <Typography variant="h5" align="center">
            {userId !== undefined && userId !== firebase.auth().currentUser?.uid
              ? user.username + "'s "
              : "Your "}
            {type === "Followers" ? "followers" : "followings"}
          </Typography>
        </>
      );
    }
  }

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
      {title()}
      <List>
        {users.map((user) => (
          <UserRectangle key={user.uid} user={user} />
        ))}
      </List>
    </>
  );
}

export default Users;
