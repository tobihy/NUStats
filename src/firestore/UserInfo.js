import React, { useState, useEffect } from "react";
import firebase from "../auth/AuthHook";
import { Avatar, CardHeader } from "@material-ui/core";
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
      setUsername(doc.data().username);
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
    });
  }, [props.uid]);

  function header() {
    return (
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
    );
  }

  return <>{header()}</>;
}

export { UserInfo };
