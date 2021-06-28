import React, { useEffect, useState } from "react";
import CPoll from "./CPoll";
import styles from "./CompletedPolls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";
import firebase from "../../../auth/AuthHook";

function CompletedPolls() {
  const [myCompletedPolls, setMyCompletedPolls] = useState([]);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const submittedPollsRef = db.collection("draftSubmittedPolls");
    submittedPollsRef
      .where("uids", "array-contains", uid)
      .orderBy("submissionTime", "desc")
      .get()
      .then((querySnapshot) => {
        const tempDocs = [];
        querySnapshot.forEach((pollRef) => {
          const { responses, uids, ...otherProps } = pollRef.data();
          const optionId = responses
            .filter((response) => response.uid === uid)
            .pop().optionId;
          tempDocs.push({
            id: pollRef.id,
            ...otherProps,
            optionId: optionId,
          });
        });
        
          "completedPolls: submittedPolls retrieved" +
            JSON.stringify(tempDocs) +
            " done"
        );
        setMyCompletedPolls(tempDocs);
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>Completed Polls</h1>
      {myCompletedPolls.map((submittedPoll, index) => (
        <Rectangle key={index}>
          <CPoll submittedPoll={submittedPoll} />
        </Rectangle>
      ))}
    </div>
  );
}

export default CompletedPolls;
