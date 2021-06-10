import React, { useState } from "react";
import Poll from "../Poll";
import { Button, TextField } from "@material-ui/core";
import Rectangle from "../../UI/Rectangle/Rectangle";
import styles from "./PollManager.module.css";
import { fsAddPoll } from "../../../firestore/Poll";
import firebase from "../../../auth/AuthHook";

export default function PollManager(props) {
  const { polls, setPolls, submittedPolls, updateSubmittedPoll } = props;
  const [newDescription, setNewDescription] = useState("");

  /* Adding polls */
  function handleAddPoll(event) {
    event.preventDefault();
    addPoll(newDescription);
  }

  async function addPoll(description) {
    const newPoll = {
      description: description,
      options: [],
      updated: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const id = await fsAddPoll(newPoll);
    const newPolls = [
      ...polls,
      {
        id: id,
        ...newPoll,
      },
    ];
    setPolls(newPolls);
  }

  function thePolls() {
    return (
      polls &&
      polls.map((poll, index) => (
        <Rectangle key={index}>
          <Poll
            polls={polls}
            poll={poll}
            index={index}
            setPolls={setPolls}
            submittedPolls={submittedPolls}
            updateSubmittedPoll={updateSubmittedPoll}
          />
        </Rectangle>
      ))
    );
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
