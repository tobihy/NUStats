import React, { useEffect, useState } from "react";
import styles from "./UncompletedPolls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";
import firebase from "../../../auth/AuthHook";
import UPoll from "./UPoll";

function UncompletedPolls(props) {
  // const [submittedPolls, setSubmittedPolls] = useState([]);
  const [myUncompletedPolls, setMyUncompletedPolls] = useState([]);
  // const [responseIds, setResponseIds] = useState([]);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const submittedPollsRef = db.collection("draftSubmittedPolls");
    submittedPollsRef
      .orderBy("submissionTime", "desc")
      .get()
      .then((querySnapshot) => {
        const tempDocs = [];
        querySnapshot.forEach((pollRef) => {
          tempDocs.push({
            id: pollRef.id,
            ...pollRef.data(),
          });
        });
        console.log(
          "uncompletedPolls: submittedPolls retrieved" +
            JSON.stringify(tempDocs) +
            " done"
        );
        const result = tempDocs.filter(
          (poll) => poll.responses.filter((id) => id === uid).length === 0
        );
        setMyUncompletedPolls(result);
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>Uncompleted Polls</h1>
      {myUncompletedPolls.map((poll, index) => (
        <Rectangle key={index}>
          <UPoll poll={poll} />
        </Rectangle>
      ))}
    </div>
  );
}

export default UncompletedPolls;
