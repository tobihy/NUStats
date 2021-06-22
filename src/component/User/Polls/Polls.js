import React, { useEffect, useState } from "react";
import styles from "./Polls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";
import firebase from "../../../auth/AuthHook";
import SortMenu from "../Parts/SortMenu";
import { Button, ButtonGroup } from "@material-ui/core";
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
      console.log("allPolls retrieved" + JSON.stringify(tempDocs) + " done");
      setAllPolls(tempDocs);
    });
  }, [selectedIndex, view]);

  function View(props) {
    return (
      <>
        <h1>{props.title}</h1>
        {props.data}
      </>
    );
  }

  function all() {
    return allPolls.map((poll, index) =>
      poll.completed ? (
        <Rectangle key={index}>
          <PollWrapper poll={poll} />
        </Rectangle>
      ) : (
        <Rectangle key={index}>
          <PollWrapper poll={poll} />
        </Rectangle>
      )
    );
  }

  function uncompleted() {
    return allPolls.map(
      (poll, index) =>
        !poll.completed && (
          <Rectangle key={index}>
            <PollWrapper poll={poll} />
          </Rectangle>
        )
    );
  }

  function completed() {
    return allPolls.map(
      (poll, index) =>
        poll.completed && (
          <Rectangle key={index}>
            <PollWrapper poll={poll} />
          </Rectangle>
        )
    );
  }

  return (
    <>
      <div className={styles.wrapper}>
        <ButtonGroup variant="contained">
          {["All Polls", "Uncompleted", "Completed"].map((name, index) => (
            <Button
              key={name}
              type="button"
              size="small"
              color={"primary"}
              variant="contained"
              disabled={view === index}
              onClick={() => setView(index)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <SortMenu
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
        />
        {view === 0 && <View title="All Polls" data={all()} />}
        {view === 1 && <View title="Uncompleted Polls" data={uncompleted()} />}
        {view === 2 && <View title="Completed Polls" data={completed()} />}
      </div>
    </>
  );
}

export default Polls;
