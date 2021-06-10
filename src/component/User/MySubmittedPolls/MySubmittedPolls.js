import React, { useEffect, useState } from "react";
import SPoll from "./SPoll";
import styles from "./MySubmittedPolls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";
import firebase from "../../../auth/AuthHook";

function MySubmittedPolls() {
  const [mySubmittedPolls, setMySubmittedPolls] = useState([]);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const snapShot = db
      .collection("draftSubmittedPolls")
      .where("creator", "==", uid)
      .orderBy("submissionTime", "desc")
      .get();

    snapShot.then((querySnapshot) => {
      const tempDocs = [];
      querySnapshot.forEach((pollRef) => {
        tempDocs.push({
          id: pollRef.id,
          ...pollRef.data(),
        });
      });
      console.log(
        "mySubmittedPolls retrieved" + JSON.stringify(tempDocs) + " done"
      );
      setMySubmittedPolls(tempDocs);
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>My Submitted Polls</h1>
      {mySubmittedPolls.map((poll) => (
        <Rectangle key={poll.id}>
          <SPoll submittedPoll={poll} />
        </Rectangle>
      ))}
    </div>
  );
}

export default MySubmittedPolls;
