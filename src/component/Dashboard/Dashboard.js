import {
  Grid,
  Typography,
  Card,
  ListItem,
  List,
  Dialog,
} from "@material-ui/core";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import firebase from "../../auth/AuthHook";
import { useEffect, useState } from "react";
// eslint-disable-next-line
import styles from "./Dashboard.module.css";
import { useTheme } from "@material-ui/styles";
import PollWrapper from "../User/Parts/PollWrapper";
// eslint-disable-next-line
import { BrowserRouter as Route, Link } from "react-router-dom";

function GridRectangle(props) {
  return (
    <Grid item xs={12} sm={6}>
      <Card elevation={2} className={styles.rectangle}>
        <Typography variant="h6">{props.title}</Typography>
        {props.children}
      </Card>
    </Grid>
  );
}

function Dashboard() {
  const theme = useTheme();
  const [submittedPolls, setSubmittedPolls] = useState([]);
  const [mySubmittedPolls, setMySubmittedPolls] = useState([]);
  const [poll, setPoll] = useState({});
  const [open, setOpen] = useState(false);
  const [randomPoll, setMyRandomPoll] = useState();

  function GridRow(props) {
    return (
      <>
        <ListItem
          key={props.index}
          xs={12}
          disableGutters
          dense
          divider={props.index < props.length - 1}
          button
          className={styles.cursor}
          onClick={() => {
            setPoll(props.poll);
            setOpen(true);
          }}
        >
          <Typography variant="body2" align="justify">
            {props.poll.description}
          </Typography>
        </ListItem>
      </>
    );
  }

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const submittedPollsRef = db.collection("draftSubmittedPolls");

    submittedPollsRef
      .orderBy("pollCount", "desc")
      .limit(5)
      .get()
      .then((querySnapshot) => {
        const tempDocs = [];
        querySnapshot.forEach((pollRef) => {
          tempDocs.push(pollRef.data());
        });
        setSubmittedPolls(tempDocs);
      });

    if (uid !== undefined) {
      const snapShot = db
        .collection("draftSubmittedPolls")
        .where("creator", "==", uid)
        .orderBy("pollCount", "desc")
        .limit(5)
        .get();

      snapShot.then((querySnapshot) => {
        const tempDocs = [];
        querySnapshot.forEach((pollRef) => {
          tempDocs.push(pollRef.data());
        });
        setMySubmittedPolls(tempDocs);
      });
    }

    submittedPollsRef
      .where("pollCount", ">", 0)
      .orderBy("pollCount", "desc")
      .limit(10)
      .get()
      .then((querySnapshot) => {
        const pollIds = [];
        querySnapshot.forEach((pollRef) => pollIds.push(pollRef.id));
        const random = Math.floor(Math.random() * pollIds.length);
        pollIds.length > 0 &&
          submittedPollsRef
            .doc(pollIds[random])
            .get()
            .then((pollSnapshot) => {
              const tempPoll = pollSnapshot.data();

              const randomOption = Math.floor(
                Math.random() * tempPoll.options.length
              );
              setMyRandomPoll({
                poll: tempPoll,
                description: tempPoll.description,
                pollCount: tempPoll.pollCount,
                optionCount: tempPoll.optionCounts[randomOption],
                optionDescription: tempPoll.options[randomOption].description,
              });
            });
      });
    return () => setSubmittedPolls([]);
  }, []);
  const [data, setData] = useState([]);

  useEffect(() => {
    const user = firebase.auth().currentUser?.uid;
    firebase
      .firestore()
      .collection("userInfo")
      .doc(user)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setData(doc.data().monthArr);
        }
      });
  }, []);

  function didYouKnow(poll) {
    console.log(poll);
    return (
      poll &&
      poll.optionCount +
        " (" +
        ((poll.optionCount / poll.pollCount) * 100).toFixed(0) +
        "%) out of " +
        poll.pollCount +
        " respondents chose " +
        poll.optionDescription +
        " in " +
        poll.description
    );
  }

  return (
    <>
      <Grid container spacing={2} justify="center">
        <Grid container item direction="row" spacing={2} alignItems="stretch">
          <GridRectangle title={"Trending Polls"}>
            <List>
              {submittedPolls.map((poll, index) => (
                <GridRow
                  key={index}
                  poll={poll}
                  length={submittedPolls.length}
                  index={index}
                />
              ))}
            </List>
          </GridRectangle>
          <GridRectangle title={"My Polls"}>
            <List>
              {mySubmittedPolls.length === 0 ? (
                <ListItem
                  xs={12}
                  disableGutters
                  dense
                  button
                  className={styles.cursor}
                  component={Link}
                  to={"/Drafts"}
                >
                  <Typography variant="body2" align="justify">
                    You have not submitted any polls, try submitting one under
                    Drafts!
                  </Typography>
                </ListItem>
              ) : (
                mySubmittedPolls.map((poll, index) => (
                  <GridRow
                    key={index}
                    poll={poll}
                    length={mySubmittedPolls.length}
                    index={index}
                  />
                ))
              )}
            </List>
          </GridRectangle>
        </Grid>
        <GridRectangle title={"Number of Polls Answered"}>
          <ResponsiveContainer aspect={1.618}>
            <LineChart data={data} margin={{ top: 20, right: 50 }}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis
                dataKey="month"
                tick={{ fill: theme.palette.text.primary }}
              />
              <YAxis
                dataKey="polls"
                tick={{ fill: theme.palette.text.primary }}
              />
              <Tooltip
                contentStyle={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.paper,
                }}
                itemStyle={{ color: theme.palette.text.primary }}
                cursor={{ fill: theme.palette.background.paper }}
              />
              <Line type="monotone" dataKey="polls" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </GridRectangle>
        <GridRectangle title={"Did you know?"}>
          <List>
            {randomPoll === undefined ? (
              <ListItem
                xs={12}
                disableGutters
                dense
                button
                className={styles.cursor}
                component={Link}
                to={"/Drafts"}
              >
                <Typography variant="body2" align="justify">
                  No one has posted any polls or there are no responses yet. You
                  can post a poll now under Drafts!
                </Typography>
              </ListItem>
            ) : (
              <ListItem
                xs={12}
                disableGutters
                dense
                button
                className={styles.cursor}
                onClick={() => {
                  setPoll(randomPoll.poll);
                  setOpen(true);
                }}
              >
                <Typography variant="body2" align="justify">
                  {didYouKnow(randomPoll)}
                </Typography>
              </ListItem>
            )}
          </List>
        </GridRectangle>
      </Grid>
      <Dialog
        onClose={() => setOpen(false)}
        aria-labelledby="simple-dialog-title"
        open={open}
        fullWidth
        maxWidth={"md"}
        classes={{ paper: styles.dialog }}
      >
        <PollWrapper poll={poll} />
      </Dialog>
    </>
  );
}

export default Dashboard;
