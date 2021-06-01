import React from "react";
import PollPreview from "../PollPreview";
import styles from "./Previewer.module.css";

function Previewer(props) {
  const { polls, editPoll } = props;

  return (
    <div className={styles.wrapper}>
      <h1>Polls Previewer</h1>
      {polls.map((poll, index) => (
        <PollPreview
          polls={polls}
          poll={poll}
          pollId={index}
          editPoll={editPoll}
        />
      ))}
    </div>
  );
}

export default Previewer;
