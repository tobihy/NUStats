import React, { useState } from "react";
import { FormControlLabel, Radio, RadioGroup, Button } from "@material-ui/core";
import styles from "./PollForUser.module.css";
import DoneIcon from "@material-ui/icons/Done";
import firebase from "../../../auth/AuthHook";

function UserPoll(props) {
  const {
    userPolls,
    submittedPolls,
    updateUserPoll,
    poll,
    pollId,
    updateSubmittedPoll,
    completed,
    userPoll,
  } = props;
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  function handleSetSubmittedPolls(event) {
    const optionId = poll.options
      .filter((i) => i.description === value)
      .pop().id;

    const newUserPolls = [...userPolls, { id: pollId, opt: optionId }];
    updateUserPoll(newUserPolls);

    const savedResponses = submittedPolls[pollId].reponses || [];

    const newSubmittedPoll = {
      id: pollId,
      uid: poll.uid,
      description: poll.description,
      options: poll.options,
      responses: [
        ...savedResponses,
        { uid: firebase.auth().currentUser?.uid, id: optionId },
      ],
    };

    const newSubmittedPolls = [
      ...submittedPolls.slice(0, pollId),
      newSubmittedPoll,
      ...submittedPolls.slice(pollId + 1),
    ];
    updateSubmittedPoll(newSubmittedPolls);
  }

  return (
    <div>
      <h2>{poll.description}</h2>
      <form onSubmit={handleSetSubmittedPolls}>
        {completed ? (
          poll.options.map((option, index) => (
            <div key={option.id}>
              {option.id === userPoll.opt ? (
                <strong>{option.description}</strong>
              ) : (
                option.description
              )}
            </div>
          ))
        ) : (
          <>
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
          </>
        )}
      </form>
    </div>
  );
}

export default UserPoll;
