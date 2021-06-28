import { Grid, Typography, Card, ListItem } from "@material-ui/core";
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

function GridRectangle(props) {
  return (
    <Grid item xs={12} sm={6}>
      <Card elevation={2} className={styles.rectangle}>
        <Typography variant="h5">{props.title}</Typography>
        {props.children}
      </Card>
    </Grid>
  );
}

function GridRow(props) {
  return (
    <>
      <ListItem
        item
        xs={12}
        disableGutters
        divider
        dense
        button
        disableRipple
        disableTouchRipple
        className={styles.cursor}
      >
        <Typography variant="body1">{props.description}</Typography>
      </ListItem>
    </>
  );
}

function Dashboard() {
  const [submittedPolls, setSubmittedPolls] = useState([]);
  const [mySubmittedPolls, setMySubmittedPolls] = useState([]);
  const [randomPoll, setMyRandomPoll] = useState({});

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
          tempDocs.push({
            description: pollRef.data().description,
            pollCount: pollRef.data().pollCount,
          });
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
          tempDocs.push({
            description: pollRef.data().description,
            pollCount: pollRef.data().pollCount,
          });
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
            {submittedPolls.map((poll, index) => (
              <GridRow
                key={index}
                description={poll.description}
                number={poll.pollCount}
              />
            ))}
          </GridRectangle>
          <GridRectangle title={"My Polls"}>
            {mySubmittedPolls.length === 0 ? (
              <Typography variant="body1">
                You have not submitted any polls, try submitting one under
                Drafts!
              </Typography>
            ) : (
              mySubmittedPolls.map((poll, index) => (
                <GridRow
                  key={index}
                  description={poll.description}
                  number={poll.pollCount}
                />
              ))
            )}
          </GridRectangle>
        </Grid>
        <GridRectangle title={"Number of Polls Answered"}>
          <ResponsiveContainer aspect={1.618}>
            <LineChart data={data} margin={{ top: 20, right: 50 }}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="month" />
              <YAxis dataKey="polls" />
              <Tooltip />
              <Line type="monotone" dataKey="polls" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </GridRectangle>
        <GridRectangle title={"Did you know?"}>
          <Typography variant="body1">{didYouKnow(randomPoll)}</Typography>
        </GridRectangle>
      </Grid>
    </>
  );
}

export default Dashboard;
