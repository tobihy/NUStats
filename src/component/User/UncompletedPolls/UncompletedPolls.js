import React, { useEffect, useState } from "react";
import styles from "./UncompletedPolls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";
import firebase from "../../../auth/AuthHook";
import SortMenu from "../SortMenu";
import UPoll from "./UPoll";

function UncompletedPolls() {
  const [myUncompletedPolls, setMyUncompletedPolls] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState();

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
        uids.filter((id) => id === uid).length === 0 &&
          tempDocs.push({
            id: pollRef.id,
            ...otherProps,
          });
      });
      
        "uncompletedPolls: submittedPolls retrieved" +
          JSON.stringify(tempDocs) +
          " done"
      );
      setMyUncompletedPolls(tempDocs);
    });
  }, [selectedIndex]);

  function submitPoll(pollId) {
    setMyUncompletedPolls(
      myUncompletedPolls.filter((poll) => poll.id !== pollId)
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1>Uncompleted Polls</h1>
      <SortMenu
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        setSelectedIndex={setSelectedIndex}
        selectedIndex={selectedIndex}
      />
      {myUncompletedPolls.map((poll, index) => (
        <Rectangle key={index}>
          <UPoll poll={poll} submitPoll={submitPoll} />
        </Rectangle>
      ))}
    </div>
  );
}

export default UncompletedPolls;
