import React, { useState, useEffect } from "react";
import ResultsPoll from "../ResultsPoll";
import UncompletedPoll from "../UncompletedPoll";
import {
  Avatar,
  CardActionArea,
  CardHeader,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  IconButton,
  Divider,
} from "@material-ui/core";
import SnackBar from "../../../UI/SnackBar";
import styles from "./PollWrapper.module.css";
import firebase from "../../../../auth/AuthHook";
// eslint-disable-next-line
import { BrowserRouter as Route, Link } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { fsLike, fsUnlike } from "../../../../firestore/Likes";

function PollWrapper(props) {
  const [username, setUsername] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { poll } = props;
  const [pollCopy, setPollCopy] = useState(poll);
  const [data, setData] = useState([]);
  const [peekResults, setPeekResults] = useState(false);
  const [like, setLike] = useState(
    poll.likes.includes(firebase.auth().currentUser?.uid)
  );
  const [likesCount, setLikesCount] = useState(poll.likesCount);

  function snackBar(message) {
    setMessage(message);
    setOpen(true);
  }

  useEffect(() => {
    const userRef = firebase
      .firestore()
      .collection("userInfo")
      .doc(pollCopy.creator)
      .get();

    userRef.then((doc) => {
      if (doc.exists) {
        setUsername(doc.data().username);
        if (doc.data().profilepic !== undefined) {
          setAvatarURL(doc.data().profilepic);
        }
      }
    });
    const tempDoc = [];
    poll.options.forEach((option) =>
      tempDoc.push({
        name: option.description,
        "Number of Responses": poll.optionCounts[option.id],
      })
    );
    setData(tempDoc);
    return () => {
      setUsername("");
      setAvatarURL("");
    };
  }, [poll, pollCopy.creator]);

  function timestamp() {
    const diffInMs = Math.abs(
      pollCopy.submissionTime.seconds * 1000 - Date.now()
    );
    const dayInMs = 86400000;
    const hoursInMs = 3600000;
    const minInMs = 60000;

    if (diffInMs / dayInMs > 7) {
      const dateInMillis = pollCopy.submissionTime.seconds * 1000;
      return new Date(dateInMillis).toLocaleDateString("en-SG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
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
    snackBar("Response submitted successfully!");
    setData(temp);
  }

  function uncompleted() {
    return (
      <>
        {peekResults || (
          <UncompletedPoll poll={pollCopy} submitPoll={submitPoll} />
        )}
        {peekResults && <ResultsPoll poll={pollCopy} data={data} />}
      </>
    );
  }

  return (
    <>
      <Grid item>
        <Card square>
          <CardActionArea component={Link} to={"/Users/" + pollCopy.creator}>
            <CardHeader
              avatar={
                avatarURL !== "" ? (
                  <Avatar src={avatarURL} alt={username} />
                ) : (
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                )
              }
              title={username}
              subheader={timestamp()}
            />
          </CardActionArea>
          <CardContent className={styles.cardcontent}>
            <Typography variant="body2" align="justify">
              {pollCopy.description}
            </Typography>
            {pollCopy.completed ? (
              <ResultsPoll poll={pollCopy} data={data} />
            ) : (
              uncompleted()
            )}
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={2}>
                <FormControlLabel
                  className={styles.likeFcl}
                  control={
                    <IconButton
                      aria-label="favourite"
                      color={like ? "secondary" : "default"}
                      size="small"
                      onClick={() => {
                        if (like) {
                          setLike(false);
                          fsUnlike(poll.id);
                          setLikesCount(likesCount - 1);
                        } else {
                          setLike(true);
                          fsLike(poll.id);
                          setLikesCount(likesCount + 1);
                        }
                      }}
                    >
                      <FavoriteIcon className={styles.likeButton} />
                    </IconButton>
                  }
                  label={
                    <Typography
                      variant="body2"
                      color={like ? "secondary" : "textPrimary"}
                    >
                      {likesCount}
                    </Typography>
                  }
                />
              </Grid>
              <Grid
                item
                container
                xs={10}
                justify="flex-end"
                alignItems="center"
              >
                {poll.nusOnly ? (
                  <>
                    <Grid item>
                      <Typography
                        variant="body2"
                        align="center"
                        className={styles.right}
                        style={{ lineHeight: 0.8 }}
                      >
                        NUS
                        <br />
                        Only
                      </Typography>
                    </Grid>
                    <Divider
                      orientation="vertical"
                      flexItem
                      classes={{ root: styles.leftAndRight }}
                    />
                  </>
                ) : null}
                <Grid item>
                  <Typography variant="body2" className={styles.right}>
                    {pollCopy.pollCount === 1
                      ? "1 response"
                      : pollCopy.pollCount + " responses"}
                  </Typography>
                </Grid>
                {pollCopy.completed ? null : pollCopy.pollCount !== 0 ? (
                  <>
                    <Divider
                      orientation="vertical"
                      flexItem
                      classes={{ root: styles.left }}
                    />
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={peekResults}
                            onChange={() => setPeekResults(!peekResults)}
                            color="primary"
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2" align="left">
                            Show Results
                          </Typography>
                        }
                        labelPlacement="start"
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <SnackBar open={open} message={message} setOpen={setOpen} />
    </>
  );
}

export default PollWrapper;
