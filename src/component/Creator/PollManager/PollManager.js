import React, { useState } from "react";
import Poll from "../Poll";
import { Button, TextField } from "@material-ui/core";
import Rectangle from "../../UI/Rectangle/Rectangle";
import styles from "./PollManager.module.css";
import GridPoll from "../../UI/GridPoll";

export default function PollManager(props) {
  const { polls, updatePoll, submittedPolls, updateSubmittedPoll } = props;
  const [newPoll, setNewPoll] = useState("");

  /* Adding polls */
  function handleAddPoll(event) {
    event.preventDefault();
    addPoll(newPoll, []);
  }

  function addPoll(description, options) {
    const newPolls = [
      ...polls,
      {
        id: polls.length,
        description: description,
        options: options,
      },
    ];
    updatePoll(newPolls);
    setNewPoll("");
  }

  function thePolls() {
    return (
      polls &&
      polls.map((poll, index) => (
        <Rectangle key={index}>
          <Poll
            polls={polls}
            poll={poll}
            key={index}
            pollId={index}
            updatePoll={updatePoll}
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
          <GridPoll
            textField={
              <TextField
                className={styles.field}
                label="Poll"
                value={newPoll}
                fullWidth
                onChange={(event) => setNewPoll(event.target.value)}
              />
            }
            button={
              <Button type="submit" variant="contained" color="primary">
                Add
              </Button>
            }
          />
        </form>
      </Rectangle>
      {thePolls()}
    </div>
  );
}
