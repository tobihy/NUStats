import React, { useState, useEffect } from "react";
import Poll from "../Poll";
import { Button, TextField, Typography, Grid } from "@material-ui/core";
import Rectangle from "../../UI/Rectangle/Rectangle";
import styles from "./PollManager.module.css";
import { fsAddPoll } from "../../../firestore/Poll";
import firebase from "../../../auth/AuthHook";
import SnackBar from "../../UI/SnackBar";
import { GridPoll } from "../../UI/GridPoll/GridPoll";

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
        setPolls(tempDocs);
      });

    return () => setPolls();
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
      nusOnly: false,
    };
    snackBar("Poll successfully added!");
    fsAddPoll(newPoll, polls, setPolls);
  }

  function thePolls() {
    return polls.map((poll, index) => (
      <Grid item xs={12} key={index}>
        <Rectangle className={styles.rectangle}>
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
          <Typography variant="h6" align="center">
            Drafts
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Rectangle square>
            <form onSubmit={handleAddPoll} className={styles.forms}>
              <GridPoll
                textField={
                  <TextField
                    fullWidth
                    className={styles.field}
                    placeholder="Poll"
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                    inputProps={{
                      style: { fontSize: 14, textAlign: "justify" },
                    }}
                  />
                }
                button={
                  <Button
                    className={styles.addButton}
                    size="small"
                    type="submit"
                    variant="contained"
                    color="primary"
                    classes={{ root: styles.addButton }}
                  >
                    Add
                  </Button>
                }
              />
            </form>
          </Rectangle>
        </Grid>
        {thePolls()}
      </Grid>
      <SnackBar open={open} message={message} setOpen={setOpen} />
    </>
  );
}
