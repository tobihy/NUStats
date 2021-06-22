import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Input,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  ButtonGroup,
} from "@material-ui/core";
import styles from "./Poll.module.css";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import { GridPoll, GridPollTwo } from "../../UI/GridPoll/GridPoll";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { fsDeletePoll, fsUpdatePoll } from "../../../firestore/Poll";
import { fsSubmitPoll } from "../../../firestore/SubmittedPoll";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";

function Poll(props) {
  const { index, poll, polls, setPolls, snackBar } = props;
  const [question, setQuestion] = useState(poll.description);
  const [options, setOptions] = useState(poll.options);
  const [newOptionText, setNewOptionText] = useState("");
  const [optionToDelete, setOptionToDelete] = useState();
  const [preview, setPreview] = useState(false);
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  function togglePreview() {
    setPreview(!preview);
  }

  function previewButton() {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={preview}
            onChange={togglePreview}
            name="Preview"
            color="primary"
          />
        }
        label="Preview"
      />
    );
  }

  function validation() {
    return (
      options.length > 1 &&
      question !== "" &&
      options.filter((opt) => opt.description === "").length === 0 &&
      options.filter(
        (opt) =>
          options.filter((op) => op.description === opt.description).length > 1
      ).length === 0
    );
  }

  function saveButton() {
    return (
      <Button
        type="submit"
        size="small"
        color="primary"
        variant="contained"
        onClick={() => {
          fsUpdatePoll(poll);
          snackBar("success", "Poll successfully saved!");
        }}
      >
        Save
        <SaveOutlinedIcon size="big" />
      </Button>
    );
  }

  function submitButton() {
    return (
      <Button
        size="small"
        color="primary"
        variant="contained"
        disabled={!validation()}
        onClick={handleSubmitPoll}
      >
        Submit
        <PublishOutlinedIcon size="big" />
      </Button>
    );
  }

  function deleteButton() {
    return (
      <Button
        type="submit"
        size="small"
        color="secondary"
        variant="contained"
        onClick={handleDeletePoll}
      >
        Delete
        <DeleteOutlineIcon size="big" />
      </Button>
    );
  }

  /* Handle Poll functions (Delete, Edit (Rename), Submit) */
  function handleDeletePoll(event) {
    event.preventDefault();
    snackBar("success", "Poll deleted successfully!");
    const newPolls = polls.filter((i) => i.id !== poll.id);
    fsDeletePoll(poll);
    setPolls(newPolls);
  }

  useEffect(() => {
    polls && setQuestion(polls[index].description);
    polls && setOptions(polls[index].options);
  }, [polls.length]); // eslint-disable-line

  function editPoll(description, options) {
    const newPoll = {
      id: poll.id,
      description: description,
      options: options,
      update: Date.now(),
    };
    const newPolls = polls.map((p) => (p.id === poll.id ? newPoll : p));
    setPolls(newPolls);
  }

  function handleEditPoll(event, qns) {
    event.preventDefault();
    setQuestion(qns);
    editPoll(qns, options);
  }

  function handleSubmitPoll(event) {
    event.preventDefault();
    snackBar("success", "Poll submitted successfully!");
    fsSubmitPoll(poll);
    fsDeletePoll(poll);
    const newPolls = polls.filter((p) => p.id !== poll.id);
    setPolls(newPolls);
  }

  /*Handle Option functions (Add, Delete, Edit) */
  function handleAddOption(event) {
    event.preventDefault();
    const newOptions = [
      ...options,
      {
        id: options.length,
        description: newOptionText,
      },
    ];
    setOptions(newOptions);
    setNewOptionText("");
    editPoll(question, newOptions);
  }

  function handleDeleteOption(event) {
    event.preventDefault();
    const newOptions = options.filter((i) => i.id !== optionToDelete.id);
    newOptions.forEach((opt, index) => (opt.id = index));
    setOptions(newOptions);
    editPoll(question, newOptions);
  }

  function handleEditOption(event, option) {
    event.preventDefault();
    const newOptions = options.map((o) => (o.id === option.id ? option : o));
    setOptions(newOptions);
    editPoll(question, newOptions);
  }

  function creator() {
    return (
      <>
        <GridPoll
          textField={
            <Input
              placeholder={"Poll"}
              value={question}
              error={question === ""}
              fullWidth
              inputProps={{ className: styles.input }}
              variant="outlined"
              onChange={(event) => handleEditPoll(event, event.target.value)}
            />
          }
        />

        {options.map((option) => (
          <GridPoll
            key={option.id}
            textField={
              <Input
                placeholder={"Option " + (option.id + 1)}
                error={
                  option.description === "" ||
                  options.filter(
                    (opt) => opt.description === option.description
                  ).length > 1
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
                placeholder="Add Option"
                fullWidth
                value={newOptionText}
                onChange={(event) => setNewOptionText(event.target.value)}
              />
            }
            button={
              <IconButton
                aria-label="add"
                type="submit"
                size="small"
                className={styles.icon}
              >
                <AddIcon size="big" />
              </IconButton>
            }
            row={true}
          />
        </form>
      </>
    );
  }

  function previewer() {
    return (
      <>
        <h2 className={styles.row}>{poll.description}</h2>
        <RadioGroup
          aria-label={poll.description}
          name={poll.description}
          value={value}
          onChange={handleChange}
        >
          {poll.options.map((option) => (
            <FormControlLabel
              key={option.id}
              className={styles.row}
              value={option.description}
              control={<Radio />}
              label={option.description}
            />
          ))}
        </RadioGroup>
      </>
    );
  }

  return (
    <>
      {preview ? previewer() : creator()}
      <GridPollTwo
        first={previewButton()}
        second={
          <>
            <ButtonGroup>
              {saveButton()}
              {deleteButton()}
              {submitButton()}
            </ButtonGroup>
          </>
        }
      />
    </>
  );
}

export default Poll;
