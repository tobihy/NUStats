import React, { useState } from "react";
import Poll from "../Poll";
import { Button, TextField } from "@material-ui/core";
import Rectangle from "../../UI/Rectangle/Rectangle";
import styles from "./PollManager.module.css";

export default function PollManager(props) {
  const { editPoll, polls, setPolls, submittedPolls, setSubmittedPolls } =
    props;
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
    setPolls(newPolls);
    setNewPoll("");
  }

  return (
    <div className={styles.wrapper}>
      <h1>Polls Creator</h1>
      <Rectangle>
        <form onSubmit={handleAddPoll} className={styles.forms}>
          <TextField
            className={styles.field}
            label="Poll"
            value={newPoll}
            onChange={(event) => setNewPoll(event.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Poll
          </Button>
        </form>
      </Rectangle>
      <div>
        <table className={styles.table}>
          {polls &&
            polls.map((poll, index) => (
              <tr key={index}>
                <Rectangle>
                  <td className={styles.polls}>
                    <Poll
                      polls={polls}
                      poll={poll}
                      pollId={index}
                      editPoll={editPoll}
                      setPolls={setPolls}
                      submittedPolls={submittedPolls}
                      setSubmittedPolls={setSubmittedPolls}
                    />
                  </td>
                </Rectangle>
              </tr>
            ))}
        </table>
      </div>
    </div>
  );
}
