import React, { useEffect, useState } from "react";
import CPoll from "./CPoll";
import styles from "./CompletedPolls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";

function CompletedPolls(props) {
  const { completedPolls } = props;
  const [polls, setPolls] = useState([]);

  useEffect(() => setPolls(completedPolls), [completedPolls]);

  return (
    <div className={styles.wrapper}>
      <h1>Completed Polls</h1>
      {polls.map((submittedPoll, index) => (
        <Rectangle key={index}>
          <CPoll submittedPoll={submittedPoll} />
        </Rectangle>
      ))}
    </div>
  );
}

export default CompletedPolls;
