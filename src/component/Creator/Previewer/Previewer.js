import React from "react";
import { Paper } from "@material-ui/core";
import PollPreview from "../PollPreview";
import styles from "./Previewer.module.css";

function Previewer(props) {
  const { polls, editPoll } = props;

  return (
    <div className={styles.wrapper}>
      <h1>Polls Previewer</h1>
      {polls.map((poll, index) => (
        <Paper key={poll.index} elevation={3}>
          <PollPreview
            polls={polls}
            poll={poll}
            pollId={index}
            editPoll={editPoll}
          />
        </Paper>
      ))}
    </div>
  );
}

export default Previewer;
