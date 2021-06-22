import React, { useState } from "react";
import { FormControlLabel, Radio, RadioGroup, Button } from "@material-ui/core";
import styles from "./UPoll.module.css";
import DoneIcon from "@material-ui/icons/Done";
import { fsSubmitResponse } from "../../../firestore/Responses";
import updateSubmitCount from "../../../backend/UserInfo";
import firebase from "../../../auth/AuthHook";

function UserPoll(props) {
  const { poll, submitPoll } = props;
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  function handleSetSubmittedPolls(event) {
    const uid = firebase.auth().currentUser?.uid;
    event.preventDefault();
    const optionId = poll.options
      .filter((i) => i.description === value)
      .pop().id;
    fsSubmitResponse(poll.id, optionId);
    submitPoll(poll.id);
    updateSubmitCount(uid);
  }

  function timestamp() {
    const dateInMillis = poll.submissionTime.seconds * 1000;
    return (
      new Date(dateInMillis).toDateString() +
      " at " +
      new Date(dateInMillis).toLocaleTimeString()
    );
  }

  function uncompletedPoll() {
    return (
      <>
        <h2>{poll.description}</h2>
        <form onSubmit={handleSetSubmittedPolls}>
          <RadioGroup
            aria-label={poll.description}
            name={poll.description}
            value={value}
            onChange={handleChange}
            className={styles.opts}
          >
            {poll.options.map((option, index) => (
              <FormControlLabel
                key={option.id}
                className={styles.opts}
                value={option.description}
                control={<Radio />}
                label={option.description}
              />
            ))}
          </RadioGroup>
          {value === "" ? (
            <Button
              type="button"
              size="small"
              variant="contained"
              className={styles.icon}
              color="default"
            >
              Submit Response
              <DoneIcon size="big" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="small"
              variant="contained"
              className={styles.icon}
              color="primary"
            >
              Submit Response
              <DoneIcon size="big" />
            </Button>
          )}
        </form>
      </>
    );
  }

  return (
    <div>
      {uncompletedPoll()}
      <div>Number of responses: {poll.pollCount}</div>
      <div>Poll created by: {poll.creator}</div>
      <div>Poll submitted on: {timestamp()}</div>
    </div>
  );
}

export default UserPoll;
