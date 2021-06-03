import React from "react";
import UserPoll from "../PollForUser";
import styles from "./CompletedPolls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";

function CompletedPolls(props) {
  const { userPolls, setUserPolls, submittedPolls, setSubmittedPolls } = props;

  return (
    <div className={styles.wrapper}>
      <h1>Completed Polls</h1>
      {userPolls
        .filter((i) => i.completed)
        .map((poll) => (
          <Rectangle key={poll.id}>
            <UserPoll
              setUserPolls={setUserPolls}
              poll={poll}
              pollId={poll.id}
              userPolls={userPolls}
              setSubmittedPolls={setSubmittedPolls}
              submittedPolls={submittedPolls}
            />
          </Rectangle>
        ))}
    </div>
  );
}

export default CompletedPolls;
