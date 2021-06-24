import React, { useState, useEffect } from "react";
import firebase from "../auth/AuthHook";
import { Avatar, CardActionArea, CardHeader } from "@material-ui/core";
// eslint-disable-next-line
import { BrowserRouter as Switch, Route, Link } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";

function UserInfo(props) {
  const [username, setUsername] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

  useEffect(() => {
    const userRef = firebase
      .firestore()
      .collection("userInfo")
      .doc(props.uid)
      .get();

    userRef.then((doc) => {
      if (doc.exists) {
        setUsername(doc.data().username);
        console.log("wtf");
        console.log("hello", doc.data().profilepic);
        doc.data().profilepic &&
          firebase
            .storage()
            .ref("profilepics")
            .child(doc.id + "_200x200.jpeg")
            .getDownloadURL()
            .then((url) => {
              console.log(url);
              setAvatarURL(url);
            });
      }
    });
  }, [props.uid]);

  function header() {
    return (
      <CardActionArea component={Link} to={"/Users/" + props.uid}>
        <CardHeader
          avatar={
            avatarURL ? (
              <Avatar src={avatarURL} alt={username} />
            ) : (
              <Avatar>
                <PersonIcon />
              </Avatar>
            )
          }
          title={username}
          subheader={props.date}
        />
      </CardActionArea>
    );
  }

  return <>{header()}</>;
}

export { UserInfo };
