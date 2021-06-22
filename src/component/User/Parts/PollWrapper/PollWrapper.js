import React, { useState, useEffect } from "react";
import { UserInfo } from "../../../../firestore/UserInfo";
import ResultsPoll from "../ResultsPoll";
import UncompletedPoll from "../UncompletedPoll";
import { ButtonGroup, Button, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function PollWrapper(props) {
  const { poll } = props;
  const [pollCopy, setPollCopy] = useState(poll);
  const [data, setData] = useState([]);
  const [view, setView] = useState(0);

  useEffect(() => {
    const tempDoc = [];
    poll.options.forEach((option) =>
      tempDoc.push({
        name: option.description,
        "Number of Responses": poll.optionCounts[option.id],
      })
    );
    setData(tempDoc);
    console.log("tempDoc", tempDoc);
  }, [poll]);

  function timestamp() {
    const diffInMs = Math.abs(
      pollCopy.submissionTime.seconds * 1000 - Date.now()
    );
    const dayInMs = 86400000;
    const hoursInMs = 3600000;
    const minInMs = 60000;
    console.log(diffInMs / dayInMs);
    if (diffInMs / dayInMs > 7) {
      const dateInMillis = pollCopy.submissionTime.seconds * 1000;
      return new Date(dateInMillis).toDateString();
    } else if (diffInMs / hoursInMs > 24) {
      const days = Math.floor(diffInMs / dayInMs);
      return days === 1 ? "Yesterday" : days + " days ago";
    } else if (diffInMs / minInMs > 60) {
      const hours = Math.floor(diffInMs / hoursInMs);
      return hours === 1 ? "1 hour ago" : hours + " hours ago";
    } else {
      return "Recent";
    }
  }

  function submitPoll(pollId, optId) {
    const { completed, pollCount, ...otherProps } = poll;
    setPollCopy({
      completed: true,
      optionId: optId,
      pollCount: pollCount + 1,
      ...otherProps,
    });
    const temp = data;
    temp[optId]["Number of Responses"]++;
    setData(temp);
  }

  function uncompleted() {
    return (
      <>
        {view === 0 && (
          <UncompletedPoll
            poll={pollCopy}
            submitPoll={submitPoll}
            snackBar={snackBar}
          />
        )}
        {view === 1 && <ResultsPoll poll={pollCopy} data={data} />}
      </>
    );
  }

  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("sucesss");
  const [message, setMessage] = useState("");

  const snackBar = (s, m) => {
    setSeverity(s);
    setMessage(m);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const classes = useStyles();

  return (
    <>
      <div>
        <UserInfo uid={pollCopy.creator} date={timestamp()} />
        <h2>{pollCopy.description}</h2>
        {pollCopy.completed || (
          <ButtonGroup>
            {["Back to Poll", "View Results"].map((name, index) => (
              <Button
                key={name}
                type="button"
                size="small"
                color="primary"
                variant="contained"
                disabled={view === index}
                onClick={() => setView(index)}
              >
                {name}
              </Button>
            ))}
          </ButtonGroup>
        )}
        {pollCopy.completed ? (
          <ResultsPoll poll={pollCopy} data={data} />
        ) : (
          uncompleted()
        )}
      </div>
      <div className={classes.root}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default PollWrapper;
