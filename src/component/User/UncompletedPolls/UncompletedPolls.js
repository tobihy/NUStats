import React from "react";
import UserPoll from "../PollForUser";
import styles from "./UncompletedPolls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";

function UncompletedPolls(props) {
  const { userPolls, setUserPolls, submittedPolls, setSubmittedPolls } = props;

  return (
    <div className={styles.wrapper}>
      <h1>Uncompleted Polls</h1>
      {userPolls
        .filter((i) => !i.completed)
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

export default UncompletedPolls;
