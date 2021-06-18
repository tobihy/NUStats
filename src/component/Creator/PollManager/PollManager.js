import React, { useState, useEffect } from "react";
import Poll from "../Poll";
import { Button, TextField } from "@material-ui/core";
import Rectangle from "../../UI/Rectangle/Rectangle";
import styles from "./PollManager.module.css";
import { fsAddPoll } from "../../../firestore/Poll";
import firebase from "../../../auth/AuthHook";

export default function PollManager() {
  const [polls, setPolls] = useState([]);
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const pollsRef = db
      .collection("userInfo")
      .doc(uid)
      .collection("draftPolls");

    pollsRef
      .orderBy("updated", "desc")
      .get()
      .then((querySnapshot) => {
        const tempDocs = [];
        querySnapshot.forEach((doc) => {
          tempDocs.push({ id: doc.id, ...doc.data() });
        });
        console.log("polls retrieved" + JSON.stringify(tempDocs) + " done");
        setPolls(tempDocs);
      });
  }, []);

  /* Adding polls */
  function handleAddPoll(event) {
    event.preventDefault();
    addPoll(newDescription);
    setNewDescription("");
  }

  async function addPoll(description) {
    const newPoll = {
      description: description,
      options: [],
      updated: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const id = await fsAddPoll(newPoll);
    const newPolls = [
      {
        id: id,
        ...newPoll,
      },
      ...polls,
    ];
    setPolls(newPolls);
  }

  function thePolls() {
    return polls.map((poll, index) => (
      <Rectangle key={index} className={styles.rectangle}>
        <Poll polls={polls} poll={poll} index={index} setPolls={setPolls} />
      </Rectangle>
    ));
  }

  return (
    <div className={styles.wrapper}>
      <h1>Polls Creator</h1>
      <Rectangle>
        <form onSubmit={handleAddPoll} className={styles.forms}>
          <TextField
            className={styles.field}
            label="Poll"
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
          />
          <Button
            className={styles.button}
            type="submit"
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </form>
      </Rectangle>
      {thePolls()}
    </div>
  );
}
