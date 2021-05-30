import React from "react";
import { Paper } from "@material-ui/core";
import UserPoll from "../PollForUser";
import styles from "./UncompletedPolls.module.css";

function UncompletedPolls(props) {
  const { userPolls, setUserPolls, submittedPolls, setSubmittedPolls } = props;

  return (
    <div className={styles.wrapper}>
      <h1>Uncompleted Polls</h1>
      {userPolls
        .filter((i) => !i.completed)
        .map((poll) => (
          <Paper key={poll.id} elevation={3}>
            <UserPoll
              setUserPolls={setUserPolls}
              poll={poll}
              pollId={poll.id}
              userPolls={userPolls}
              setSubmittedPolls={setSubmittedPolls}
              submittedPolls={submittedPolls}
            />
          </Paper>
        ))}
    </div>
  );
}

export default UncompletedPolls;
