import { Grid, Typography } from "@material-ui/core";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import Rectangle from "../UI/Rectangle";
import firebase from "../../auth/AuthHook";
import { useEffect, useState } from "react";
import { initialiseSubmitCount } from "../../backend/UserInfo";

import styles from "./Dashboard.module.css";

function GridRectangle(props) {
  return (
    <Grid item xs={12} sm={6}>
      <Rectangle>
        <Typography variant="h5">{props.title}</Typography>
        {props.children}
      </Rectangle>
    </Grid>
  );
}

function GridRow(props) {
  return (
    <>
      <Grid item container>
        <Grid item xs={10} sm={11}>
          {props.description}
        </Grid>
        <Grid item xs={2} sm={1}>
          {props.number}
        </Grid>
      </Grid>
    </>
  );
}

function Dashboard() {
  const [submittedPolls, setSubmittedPolls] = useState([]);
  const [mySubmittedPolls, setMySubmittedPolls] = useState([]);
  const [randomPoll, setMyRandomPoll] = useState();

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
        console.log(
          "submittedPolls retrieved" + JSON.stringify(tempDocs) + " done"
        );
        setSubmittedPolls(tempDocs);
      });

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
      console.log(
        "mySubmittedPolls retrieved" + JSON.stringify(tempDocs) + " done"
      );
      setMySubmittedPolls(tempDocs);
    });

    submittedPollsRef
      .where("pollCount", ">", 0)
      .orderBy("pollCount", "desc")
<<<<<<< HEAD
      .limit(10)
=======
      .limit(100)
>>>>>>> 93efff648338c14e63e0520c8a02d8cd71c76598
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
              console.log(tempPoll);
              const randomOption = Math.floor(
                Math.random() * tempPoll.options.length
              );
<<<<<<< HEAD
              setMyRandomPoll({
                description: tempPoll.description,
                pollCount: tempPoll.pollCount,
                optionCount: tempPoll.optionCounts[randomOption],
                optionDescription: tempPoll.options[randomOption].description,
              });
=======
              submittedPollsRef
                .doc(pollSnapshot.id)
                .collection("options")
                .doc(randomOption.toString())
                .get()
                .then((optSnapshot) => {
                  setMyRandomPoll({
                    description: tempPoll.description,
                    pollCount: tempPoll.pollCount,
                    optionCount: optSnapshot.data().optionCount,
                    optionDescription:
                      tempPoll.options[randomOption].description,
                  });
                });
>>>>>>> 93efff648338c14e63e0520c8a02d8cd71c76598
            });
      });
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
        if (!doc.exists) {
          initialiseSubmitCount(user);
        }
      });
  }, []);

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
<<<<<<< HEAD
        ((poll.optionCount / poll.pollCount) * 100).toFixed(0) +
=======
        (poll.optionCount / poll.pollCount) * 100 +
>>>>>>> 93efff648338c14e63e0520c8a02d8cd71c76598
        "%) out of " +
        poll.pollCount +
        " respondents chose " +
        poll.optionDescription +
        " in " +
        poll.description
    );
  }

  return (
    <div className={styles.wrapper}>
      <Grid container spacing={4}>
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
          {mySubmittedPolls.map((poll, index) => (
            <GridRow
              key={index}
              description={poll.description}
              number={poll.pollCount}
            />
          ))}
        </GridRectangle>
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
          {didYouKnow(randomPoll)}
        </GridRectangle>
      </Grid>
    </div>
  );
}

export default Dashboard;
