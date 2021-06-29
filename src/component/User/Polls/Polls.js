import React, { useEffect, useState } from "react";
import firebase from "../../../auth/AuthHook";
import SortMenu from "../Parts/SortMenu";
import { Grid, Tabs, Tab } from "@material-ui/core";
import PollWrapper from "../Parts/PollWrapper";

function Polls() {
  const [allPolls, setAllPolls] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [view, setView] = useState(0);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const submittedPollsRef = db.collection("draftSubmittedPolls");
    const sorted =
      selectedIndex < 2
        ? submittedPollsRef.orderBy(
            "submissionTime",
            selectedIndex === 0 ? "desc" : "asc"
          )
        : selectedIndex < 4
        ? submittedPollsRef.orderBy(
            "pollCount",
            selectedIndex === 2 ? "desc" : "asc"
          )
        : submittedPollsRef.orderBy(
            "description",
            selectedIndex === 4 ? "asc" : "desc"
          );

    sorted.get().then((querySnapshot) => {
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

      setAllPolls(tempDocs);
    });
    return () => setAllPolls([]);
  }, [selectedIndex, view]);

  function View(props) {
    return (
      <>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
          spacing={2}
        >
          {props.data}
        </Grid>
      </>
    );
  }

  function all() {
    return allPolls.map((poll, index) => (
      <PollWrapper poll={poll} key={index} />
    ));
  }

  function uncompleted() {
    return allPolls.map(
      (poll, index) =>
        !poll.completed && <PollWrapper poll={poll} key={index} />
    );
  }

  function completed() {
    return allPolls.map(
      (poll, index) => poll.completed && <PollWrapper poll={poll} key={index} />
    );
  }

  return (
    <>
      <Tabs
        value={view}
        onChange={(event, newValue) => setView(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        centered
      >
        <Tab label="All Polls" />
        <Tab label="Uncompleted" />
        <Tab label="Completed" />
      </Tabs>
      <SortMenu
        setSelectedIndex={setSelectedIndex}
        selectedIndex={selectedIndex}
      />
      {view === 0 && <View data={all()} />}
      {view === 1 && <View data={uncompleted()} />}
      {view === 2 && <View data={completed()} />}
    </>
  );
}

export default Polls;
