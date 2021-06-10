import React from "react";

function CPoll(props) {
  const { submittedPoll } = props;

  function timestamp() {
    const dateInMillis = submittedPoll.submissionTime.seconds * 1000;
    return (
      new Date(dateInMillis).toDateString() +
      " at " +
      new Date(dateInMillis).toLocaleTimeString()
    );
  }

  function completedPolls() {
    console.log("rendering", submittedPoll.description);
    return (
      <>
        <h2>{submittedPoll.description}</h2>
        {submittedPoll.options.map((option, index) => (
          <div key={option.id}>
            {option.id === submittedPoll.optionId ? (
              <strong>{option.description}</strong>
            ) : (
              option.description
            )}
          </div>
        ))}
      </>
    );
  }

  return (
    <div>
      {completedPolls()}
      <div>Poll created by: {submittedPoll.creator}</div>
      <div>Poll submitted on: {timestamp()}</div>
    </div>
  );
}

export default CPoll;
