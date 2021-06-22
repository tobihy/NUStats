import React, { useState } from "react";
import { FormControlLabel, Radio, RadioGroup, Button } from "@material-ui/core";
import styles from "./UncompletedPoll.module.css";
import DoneIcon from "@material-ui/icons/Done";
import { fsSubmitResponse } from "../../../../firestore/Responses";
import updateSubmitCount from "../../../../backend/UserInfo";
import firebase from "../../../../auth/AuthHook";

function UncompletedPoll(props) {
  const { poll, submitPoll, snackBar } = props;
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  function handleSetSubmittedPolls(event) {
    const uid = firebase.auth().currentUser?.uid;
    event.preventDefault();
    snackBar("success", "Response successfully submitted!");
    const optionId = poll.options
      .filter((i) => i.description === value)
      .pop().id;
    fsSubmitResponse(poll.id, optionId);
    submitPoll(poll.id, optionId);
    updateSubmitCount(uid);
  }

  return (
    <>
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
        <Button
          type="submit"
          size="small"
          variant="contained"
          className={styles.icon}
          color="primary"
          disabled={value === ""}
        >
          Submit Response
          <DoneIcon size="big" />
        </Button>
      </form>
      <div>Number of responses: {poll.pollCount}</div>
    </>
  );
}

export default UncompletedPoll;
