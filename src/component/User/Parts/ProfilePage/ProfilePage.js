import React, { useEffect, useState } from "react";
import firebase from "../../../../auth/AuthHook";
import { Grid } from "@material-ui/core";
import PollWrapper from "../PollWrapper";
import { useParams } from "react-router-dom";

function ProfilePage(props) {
  const [mySubmittedPolls, setMySubmittedPolls] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const uid = props.uid || userId;
    const db = firebase.firestore();
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
      <h1>My Submitted Polls</h1>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={2}
      >
        {mySubmittedPolls.map((poll) => (
          <PollWrapper poll={poll} key={poll.id} />
        ))}
      </Grid>
    </>
  );
}

export default ProfilePage;
