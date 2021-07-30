import React, { useEffect, useState } from "react";
import firebase from "../../../auth/AuthHook";
import SortMenu from "../Parts/SortMenu";
import { Grid, Typography } from "@material-ui/core";
import PollWrapper from "../Parts/PollWrapper";

function Polls() {
  const [polls, setPolls] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [view, setView] = useState(0);
  const [followings, setFollowings] = useState(["empty"]);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("userInfo")
      .doc(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const following = [...snapshot.data().followings, uid];
          setFollowings(following);
        }
      });
  }, []);

  function getPolls() {
    const uid = firebase.auth().currentUser?.uid;
    const userFromNUS = firebase
      .auth()
      .currentUser?.email.split("@")[1]
      .includes("nus.edu");

    const submittedPollsRef = firebase
      .firestore()
      .collection("draftSubmittedPolls");
    const filtered =
      view === 0 && followings.length <= 10
        ? submittedPollsRef.where("creator", "in", followings)
        : view === 2
        ? submittedPollsRef.where("nusOnly", "==", true)
        : view === 3
        ? submittedPollsRef.where("uids", "array-contains", uid)
        : submittedPollsRef;

    const sorted =
      selectedIndex < 2
        ? filtered.orderBy(
            "submissionTime",
            selectedIndex === 0 ? "desc" : "asc"
          )
        : selectedIndex < 4
        ? filtered.orderBy("pollCount", selectedIndex === 2 ? "desc" : "asc")
        : selectedIndex < 6
        ? filtered.orderBy("likesCount", selectedIndex === 4 ? "desc" : "asc")
        : filtered.orderBy("searchQns", selectedIndex === 6 ? "asc" : "desc");

    sorted.get().then((querySnapshot) => {
      const tempDocs = [];
      querySnapshot.forEach((pollRef) => {
        if (view === 0 && !followings.includes(pollRef.data().creator)) {
        } else {
          const { responses, uids, ...otherProps } = pollRef.data();
          const filteredResponse = responses.filter(
            (response) => response.uid === uid
          );
          if (filteredResponse.length === 0) {
            tempDocs.push({
              id: pollRef.id,
              ...otherProps,
              completed: false,
              userFromNUS: userFromNUS,
            });
          } else {
            if (view !== 4) {
              tempDocs.push({
                id: pollRef.id,
                ...otherProps,
                completed: true,
                optionId: filteredResponse.pop().optionId,
                userFromNUS: userFromNUS,
              });
            }
          }
        }
      });
      setPolls(tempDocs);
    });
  }

  useEffect(() => {
    getPolls();
    return () => setPolls([]);
    //eslint-disable-next-line
  }, [selectedIndex, view, followings]);

  function nothing() {
    switch (view) {
      case 0:
        return "None of the user(s) that you have followed posted anything.";
      case 1:
        return "No one posted anything yet.";
      case 2:
        return "No one posted any NUS only polls yet.";
      case 3:
        return "You have not completed any polls yet.";
      default:
        return "You have completed all possible polls!";
    }
  }

  return (
    <>
      <Grid container justify="space-between" spacing={2}>
        <Grid item xs={6}>
          <SortMenu
            setSelectedIndex={setView}
            selectedIndex={view}
            filter={true}
          />
        </Grid>
        <Grid item xs={6}>
          <SortMenu
            setSelectedIndex={setSelectedIndex}
            selectedIndex={selectedIndex}
            filter={false}
          />
        </Grid>
      </Grid>

      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={2}
      >
        {polls.length === 0 ? (
          <Typography align="center" variant="body1">
            {nothing()}
          </Typography>
        ) : (
          polls.map((poll, index) => <PollWrapper poll={poll} key={index} />)
        )}
      </Grid>
    </>
  );
}

export default Polls;
