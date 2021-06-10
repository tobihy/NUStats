import { Grid, Typography, List, ListItemText } from "@material-ui/core";
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
    <>
      <Grid item xs={12} sm={6}>
        <Rectangle>
          <Typography variant="h5">{props.title}</Typography>
          {props.children}
        </Rectangle>
      </Grid>
    </>
  );
}

function Dashboard(props) {
  const { submittedPolls } = props;
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
  });

  return (
    <div className={styles.wrapper}>
      <Grid container>
        <GridRectangle title={"Trending Polls"}>
          <List>
            {submittedPolls.map((poll) => (
              <ListItemText key={poll.id}>{poll.description}</ListItemText>
            ))}
          </List>
        </GridRectangle>
        <GridRectangle title={"My Polls"}>
          <List>
            {submittedPolls
              .filter((poll) => {
                return poll.uid === firebase.auth().currentUser?.uid;
              })
              .map((poll) => (
                <ListItemText key={poll.id}>{poll.description}</ListItemText>
              ))}
          </List>
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
        <GridRectangle title={"Did you know?"}>To be implemented</GridRectangle>
      </Grid>
    </div>
  );
}

export default Dashboard;
