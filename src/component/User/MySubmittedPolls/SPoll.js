import React from "react";

function SPoll(props) {
  const { submittedPoll } = props;

  function timestamp() {
    const dateInMillis = submittedPoll.submissionTime.seconds * 1000;
    return (
      new Date(dateInMillis).toDateString() +
      " at " +
      new Date(dateInMillis).toLocaleTimeString()
    );
  }

  function mySubmittedPoll() {
    return (
      <>
        <h2>{submittedPoll.description}</h2>
        {submittedPoll.options.map((option, index) => (
          <div key={option.id}>{option.description}</div>
        ))}
      </>
    );
  }

  return (
    <div>
      {mySubmittedPoll()}
      <div>Poll submitted on: {timestamp()}</div>
    </div>
  );
}

export default SPoll;
