import React, { useState } from "react";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
} from "@material-ui/core";
import styles from "./PollForUser.module.css";
import DoneIcon from "@material-ui/icons/Done";

function UserPoll(props) {
  const {
    userPolls,
    submittedPolls,
    setUserPolls,
    poll,
    pollId,
    setSubmittedPolls,
  } = props;
  const [value, setValue] = useState(poll.responses);
  // eslint-disable-next-line
  const [completed, setCompleted] = useState(poll.completed);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  function handleSetSubmittedPolls(event) {
    const newPoll = poll;
    setCompleted(true);
    newPoll.responses = value;
    newPoll.completed = true;
    const newUserPolls = [
      ...userPolls.slice(0, pollId),
      newPoll,
      ...userPolls.slice(pollId + 1),
    ];
    setUserPolls(newUserPolls);

    const savedPoll = submittedPolls[pollId];
    const newSubmittedPoll = {
      id: pollId,
      description: poll.description,
      options: poll.options,
      responses: [
        ...savedPoll.responses,
        poll.options.filter((i) => i.description === value).pop().id,
      ],
    };

    const newSubmittedPolls = [
      ...submittedPolls.slice(0, pollId),
      newSubmittedPoll,
      ...submittedPolls.slice(pollId + 1),
    ];
    setSubmittedPolls(newSubmittedPolls);
    setUserPolls(newUserPolls);
  }

  return (
    <div>
      <h2>{poll.description}</h2>
      <form onSubmit={handleSetSubmittedPolls}>
        {poll.completed ? (
          poll.options.map((option, index) => (
            <div key={option.id}>
              {option.description === poll.responses ? (
                <strong>{poll.responses}</strong>
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
            <IconButton
              aria-label="submit"
              type="submit"
              size="small"
              className={styles.icon}
              color="secondary"
            >
              <DoneIcon size="big" />
            </IconButton>
          </>
        )}
      </form>
    </div>
  );
}

export default UserPoll;
