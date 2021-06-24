import React, { useState, useEffect } from "react";
import Poll from "../Poll";
import { Button, TextField, Typography, Grid } from "@material-ui/core";
import Rectangle from "../../UI/Rectangle/Rectangle";
import styles from "./PollManager.module.css";
import { fsAddPoll } from "../../../firestore/Poll";
import firebase from "../../../auth/AuthHook";
import SnackBar from "../../UI/SnackBar";

export default function PollManager() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [polls, setPolls] = useState([]);
  const [newDescription, setNewDescription] = useState("");

  function snackBar(message) {
    setMessage(message);
    setOpen(true);
  }

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const pollsRef = db
      .collection("userInfo")
      .doc(uid)
      .collection("draftPolls");

    pollsRef
      .orderBy("updated", "desc")
      .get()
      .then((querySnapshot) => {
        const tempDocs = [];
        querySnapshot.forEach((doc) => {
          tempDocs.push({ id: doc.id, ...doc.data() });
        });
        console.log("polls retrieved" + JSON.stringify(tempDocs) + " done");
        setPolls(tempDocs);
      });
  }, []);

  /* Adding polls */
  function handleAddPoll(event) {
    event.preventDefault();
    addPoll(newDescription);
    setNewDescription("");
  }

  function addPoll(description) {
    const newPoll = {
      description: description,
      options: [],
      updated: Date.now(),
    };
    snackBar("Poll successfully added!");
    fsAddPoll(newPoll, polls, setPolls);
  }

  function thePolls() {
    return polls.map((poll, index) => (
      <Grid item xs={12}>
        <Rectangle key={index} className={styles.rectangle}>
          <Poll
            polls={polls}
            poll={poll}
            index={index}
            setPolls={setPolls}
            setOpen={open}
            snackBar={snackBar}
          />
        </Rectangle>
      </Grid>
    ));
  }

  return (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            Drafts
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Rectangle>
            <form onSubmit={handleAddPoll} className={styles.forms}>
              <TextField
                className={styles.field}
                label="Poll"
                value={newDescription}
                onChange={(event) => setNewDescription(event.target.value)}
              />
              <Button
                className={styles.button}
                type="submit"
                variant="contained"
                color="primary"
              >
                Add
              </Button>
            </form>
          </Rectangle>
        </Grid>
        {thePolls()}
      </Grid>
      <SnackBar open={open} message={message} setOpen={setOpen} />
    </>
  );
}
