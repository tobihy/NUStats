import React from "react";
import UserPoll from "../PollForUser";
import styles from "./UncompletedPolls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";

function UncompletedPolls(props) {
  const { userPolls, updateUserPoll, submittedPolls, updateSubmittedPoll } =
    props;

  return (
    <div className={styles.wrapper}>
      <h1>Uncompleted Polls</h1>
      {submittedPolls
        .filter((sp) => userPolls.filter((up) => up.id === sp.id).length === 0)
        .map((poll) => (
          <Rectangle key={poll.id}>
            <UserPoll
              updateUserPoll={updateUserPoll}
              poll={poll}
              pollId={poll.id}
              userPolls={userPolls}
              updateSubmittedPoll={updateSubmittedPoll}
              submittedPolls={submittedPolls}
              completed={false}
            />
          </Rectangle>
        ))}
    </div>
  );
}

export default UncompletedPolls;
