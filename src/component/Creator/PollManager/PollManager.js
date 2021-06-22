import React, { useState, useEffect } from "react";
import Poll from "../Poll";
import { Button, TextField, Snackbar } from "@material-ui/core";
import Rectangle from "../../UI/Rectangle/Rectangle";
import styles from "./PollManager.module.css";
import { fsAddPoll } from "../../../firestore/Poll";
import firebase from "../../../auth/AuthHook";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

export default function PollManager() {
  const [polls, setPolls] = useState([]);
  const [newDescription, setNewDescription] = useState("");

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
    snackBar("success", "Poll successfully added!");
    fsAddPoll(newPoll, polls, setPolls);
  }

  function thePolls() {
    return polls.map((poll, index) => (
      <Rectangle key={index} className={styles.rectangle}>
        <Poll
          polls={polls}
          poll={poll}
          index={index}
          setPolls={setPolls}
          snackBar={snackBar}
        />
      </Rectangle>
    ));
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
      <div className={styles.wrapper}>
        <h1>Polls Creator</h1>
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
        {thePolls()}
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
