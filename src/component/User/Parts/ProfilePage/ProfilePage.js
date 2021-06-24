import React, { useEffect, useState } from "react";
import firebase from "../../../../auth/AuthHook";
import { Grid, Typography, Avatar, makeStyles } from "@material-ui/core";
import PollWrapper from "../PollWrapper";
import { useParams } from "react-router-dom";
// import styles from "./ProfilePage.module.css";

function ProfilePage(props) {
  const [mySubmittedPolls, setMySubmittedPolls] = useState([]);
  const [username, setUsername] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const { userId } = useParams();

  const useStyles = makeStyles((theme) => ({
    sizeAvatar: {
      height: theme.spacing(20),
      width: theme.spacing(20),
      marginLeft: "auto",
      marginRight: "auto",
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    const uid = props.uid || userId;
    const db = firebase.firestore();

    const userRef = firebase.firestore().collection("userInfo").doc(uid).get();

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

    const snapShot = db
      .collection("draftSubmittedPolls")
      .where("creator", "==", uid)
      .orderBy("submissionTime", "desc")
      .get();

    snapShot.then((querySnapshot) => {
      const tempDocs = [];
      querySnapshot.forEach((pollRef) => {
        const { responses, uids, ...otherProps } = pollRef.data();
        const filtered = responses.filter((response) => response.uid === uid);
        if (filtered.length === 0) {
          tempDocs.push({
            id: pollRef.id,
            ...otherProps,
            completed: false,
          });
        } else {
          tempDocs.push({
            id: pollRef.id,
            ...otherProps,
            completed: true,
            optionId: filtered.pop().optionId,
          });
        }
      });
      console.log(
        "mySubmittedPolls retrieved" + JSON.stringify(tempDocs) + " done"
      );
      setMySubmittedPolls(tempDocs);
    });
  }, [props.uid, userId]);

  return (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={2}
      >
        <Grid item xs={12}>
          <Avatar
            alt={username}
            src={avatarURL}
            className={classes.sizeAvatar}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            {username}
          </Typography>
        </Grid>
        {mySubmittedPolls.map((poll) => (
          <PollWrapper poll={poll} key={poll.id} />
        ))}
      </Grid>
    </>
  );
}

export default ProfilePage;
