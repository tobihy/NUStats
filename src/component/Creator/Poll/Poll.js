import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Input } from "@material-ui/core";
import styles from "./Poll.module.css";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import GridPoll from "../../UI/GridPoll";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import firebase from "../../../auth/AuthHook";

function Poll(props) {
  const {
    poll,
    polls,
    pollId,
    updatePoll,
    submittedPolls,
    updateSubmittedPoll,
  } = props;
  const [question, setQuestion] = useState(poll.description);
  const [options, setOptions] = useState(poll.options);
  const [newOptionText, setNewOptionText] = useState("");
  const [optionToDelete, setOptionToDelete] = useState();

  /* Handle Poll functions (Delete, Edit (Rename), Submit) */
  function handleDeletePoll(event) {
    event.preventDefault();
    const newPolls = polls.filter((i) => i.id !== pollId);
    newPolls.forEach((p, index) => (p.id = index));
    console.log(newPolls);
    updatePoll(newPolls);
  }

  useEffect(() => {
    polls && setQuestion(polls[pollId].description);
    polls && setOptions(polls[pollId].options);
  }, [polls.length]); // eslint-disable-line

  function editPoll(description, options, pollId) {
    const newPolls = [
      ...polls.slice(0, pollId),
      {
        id: pollId,
        description: description,
        options: options,
      },
      ...polls.slice(pollId + 1),
    ];
    updatePoll(newPolls);
  }

  function handleEditPoll(event, qns) {
    event.preventDefault();
    setQuestion(qns);
    editPoll(qns, options, pollId);
  }

  function handleSubmitPoll(event) {
    event.preventDefault();
    const newSubmittedPolls = [
      ...submittedPolls,
      {
        uid: firebase.auth().currentUser?.uid,
        id: submittedPolls.length,
        description: question,
        options: options,
        responses: [],
      },
    ];
    updateSubmittedPoll(newSubmittedPolls);
    const newPolls = [...polls.slice(0, pollId), ...polls.slice(pollId + 1)];
    updatePoll(newPolls);
  }

  /*Handle Option functions (Add, Delete, Edit) */
  function handleAddOption(event) {
    event.preventDefault();
    addOption(newOptionText);
  }

  function addOption(description) {
    const newOptions = [
      ...options,
      {
        id: options.length,
        description: description,
      },
    ];
    setOptions(newOptions);
    setNewOptionText("");
    editPoll(question, newOptions, pollId);
  }

  function handleDeleteOption(event) {
    event.preventDefault();
    deleteOption(optionToDelete);
  }

  function deleteOption(option) {
    const newOptions = options.filter((i) => i.id !== option.id);
    newOptions.forEach((opt, index) => (opt.id = index));
    setOptions(newOptions);
    editPoll(question, newOptions, pollId);
  }

  function handleEditOption(event, option) {
    event.preventDefault();
    editOption(option);
  }

  function editOption(option) {
    const newOptions = [
      ...options.slice(0, option.id),
      option,
      ...options.slice(option.id + 1),
    ];
    setOptions(newOptions);
    editPoll(question, newOptions, pollId);
  }

  return (
    <>
      <GridPoll
        textField={
          <TextField
            className={styles.field}
            label={"Poll " + (pollId + 1)}
            value={question}
            error={question === ""}
            variant="outlined"
            fullWidth
            onChange={(event) => handleEditPoll(event, event.target.value)}
          />
        }
      />

      {options.map((option) => (
        <GridPoll
          key={option.id}
          textField={
            <Input
              className={styles.field}
              size="small"
              placeholder={"Option " + (option.id + 1)}
              error={
                option.description === "" ||
                options.filter((opt) => opt.description === option.description)
                  .length > 1
              }
              fullWidth
              value={option.description}
              onChange={(event) => {
                handleEditOption(event, {
                  id: option.id,
                  description: event.target.value,
                });
              }}
            />
          }
          button={
            <form onSubmit={handleDeleteOption} className={styles.forms}>
              <IconButton
                aria-label="delete"
                type="submit"
                size="small"
                className={styles.icon}
                onClick={() => setOptionToDelete(option)}
              >
                <ClearIcon size="big" />
              </IconButton>
            </form>
          }
          row={true}
        />
      ))}
      <form onSubmit={handleAddOption}>
        <GridPoll
          textField={
            <TextField
              size="small"
              label="Add Option"
              fullWidth
              className={styles.field}
              value={newOptionText}
              onChange={(event) => setNewOptionText(event.target.value)}
            />
          }
          button={
            <IconButton edge="end" aria-label="add" type="submit" size="small">
              <AddIcon size="big" />
            </IconButton>
          }
          row={true}
        />
      </form>
      <Grid container>
        <Grid item lg={3} md={3} xs={2}></Grid>
        <Grid item container lg={8} md={8} xs={9}>
          <Grid item container lg={4} md={4} xs={9}>
            <Grid item xs={5} md={4} lg={4}>
              {options.length > 1 &&
              question !== "" &&
              options.filter((opt) => opt.description === "").length === 0 &&
              options.filter(
                (opt) =>
                  options.filter((op) => op.description === opt.description)
                    .length > 1
              ).length === 0 ? (
                <form
                  onSubmit={handleSubmitPoll}
                  className={styles.field && styles.row}
                >
                  <Button
                    aria-label="delete"
                    type="submit"
                    size="small"
                    color="primary"
                    variant="contained"
                    className={styles.field}
                  >
                    Submit
                    <PublishOutlinedIcon size="big" />
                  </Button>
                </form>
              ) : (
                <div className={styles.row}>
                  <Button
                    aria-label="delete"
                    size="small"
                    variant="contained"
                    color="default"
                    className={styles.field}
                  >
                    Submit
                    <PublishOutlinedIcon size="big" />
                  </Button>
                </div>
              )}
            </Grid>
            <Grid item xs={2} md={4} lg={4}></Grid>
            <Grid item xs={5} md={4} lg={4}>
              <form
                onSubmit={handleDeletePoll}
                className={styles.field && styles.row}
              >
                <Button
                  aria-label="delete"
                  type="submit"
                  size="small"
                  color="secondary"
                  variant="contained"
                  className={styles.field}
                >
                  Delete
                  <DeleteOutlineIcon size="big" />
                </Button>
              </form>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={1} md={1} xs={1}></Grid>
      </Grid>
    </>
  );
}

export default Poll;
