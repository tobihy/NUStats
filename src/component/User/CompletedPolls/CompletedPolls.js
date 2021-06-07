import React from "react";
import UserPoll from "../PollForUser";
import styles from "./CompletedPolls.module.css";
import Rectangle from "../../UI/Rectangle/Rectangle";

function CompletedPolls(props) {
  const { userPolls, updateUserPoll, submittedPolls, updateSubmittedPoll } =
    props;

  return (
    <div className={styles.wrapper}>
      <h1>Completed Polls</h1>
      {submittedPolls
        .filter((sp) => userPolls.filter((up) => up.id === sp.id).length === 1)
        .map((poll) => (
          <Rectangle key={poll.id}>
            <UserPoll
              updateUserPoll={updateUserPoll}
              poll={poll}
              pollId={poll.id}
              userPolls={userPolls}
              updateSubmittedPoll={updateSubmittedPoll}
              submittedPolls={submittedPolls}
              completed={true}
              userPoll={userPolls.filter((up) => up.id === poll.id).pop()}
            />
          </Rectangle>
        ))}
    </div>
  );
}

export default CompletedPolls;
