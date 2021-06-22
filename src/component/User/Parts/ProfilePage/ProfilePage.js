import React, { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";
import Rectangle from "../../../UI/Rectangle/Rectangle";
import firebase from "../../../../auth/AuthHook";
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
    <div className={styles.wrapper}>
      <h1>My Submitted Polls</h1>
      {mySubmittedPolls.map((poll) => (
        <Rectangle key={poll.id}>
          <PollWrapper poll={poll} />
        </Rectangle>
      ))}
    </div>
  );
}

export default ProfilePage;
