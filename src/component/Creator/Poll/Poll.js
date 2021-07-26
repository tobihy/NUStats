import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  ButtonGroup,
  Typography,
  List,
  ListItem,
} from "@material-ui/core";
import styles from "./Poll.module.css";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import PublishIcon from "@material-ui/icons/Publish";
import { GridPoll, GridPollTwo } from "../../UI/GridPoll/GridPoll";
import DeleteIcon from "@material-ui/icons/Delete";
import { fsDeletePoll, fsUpdatePoll } from "../../../firestore/Poll";
import { fsSubmitPoll } from "../../../firestore/SubmittedPoll";
import SaveIcon from "@material-ui/icons/Save";

function Poll(props) {
  const { index, poll, polls, setPolls, snackBar } = props;
  const [question, setQuestion] = useState(poll.description);
  const [options, setOptions] = useState(poll.options);
  const [newOptionText, setNewOptionText] = useState("");
  const [optionToDelete, setOptionToDelete] = useState();
  const [preview, setPreview] = useState(false);
  const [nusOnly, setNusOnly] = useState(poll.nusOnly);
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
            size="small"
          />
        }
        label={<Typography variant="body2">Preview</Typography>}
      />
    );
  }

  function nusOnlySwitch() {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={nusOnly}
            onChange={() => {
              editPoll(question, options, !nusOnly);
              setNusOnly(!nusOnly);
            }}
            name="NUS Only"
            color="primary"
            size="small"
          />
        }
        label={
          <Typography variant="body2" style={{ lineHeight: 1 }} align="center">
            NUS
            <br />
            Only
          </Typography>
        }
      />
    );
  }

  function saveButton() {
    return (
      <Button
        size="small"
        color="primary"
        variant="contained"
        disabled={!validation(question)}
        onClick={() => {
          fsUpdatePoll(poll);
          snackBar("Poll saved!");
        }}
        endIcon={<SaveIcon />}
      >
        Save
      </Button>
    );
  }

  function submitButton() {
    return (
      <Button
        size="small"
        color="primary"
        variant="contained"
        disabled={!validation(question)}
        onClick={handleSubmitPoll}
        endIcon={<PublishIcon />}
      >
        Submit
      </Button>
    );
  }

  function deleteButton() {
    return (
      <IconButton
        type="submit"
        size="small"
        color="secondary"
        className={styles.icon}
        onClick={handleDeletePoll}
      >
        <DeleteIcon />
      </IconButton>
    );
  }

  /* Handle Poll functions (Delete, Edit (Rename), Submit) */
  function handleDeletePoll(event) {
    event.preventDefault();
    snackBar("Poll deleted!");
    const newPolls = polls.filter((i) => i.id !== poll.id);
    fsDeletePoll(poll);
    setPolls(newPolls);
  }

  useEffect(() => {
    polls && setQuestion(polls[index].description);
    polls && setOptions(polls[index].options);
  }, [polls.length]); // eslint-disable-line

  function editPoll(description, options, nusOnly) {
    const newPoll = {
      id: poll.id,
      description: description,
      options: options,
      update: Date.now(),
      nusOnly: nusOnly,
    };
    const newPolls = polls.map((p) => (p.id === poll.id ? newPoll : p));
    setPolls(newPolls);
  }

  function handleEditPoll(event, qns) {
    event.preventDefault();
    setQuestion(qns);
    editPoll(qns, options, nusOnly);
  }

  function handleSubmitPoll(event) {
    event.preventDefault();
    snackBar("Poll submitted!");
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
    editPoll(question, newOptions, nusOnly);
  }

  function handleDeleteOption(event) {
    event.preventDefault();
    const newOptions = options.filter((i) => i.id !== optionToDelete.id);
    newOptions.forEach((opt, index) => (opt.id = index));
    setOptions(newOptions);
    editPoll(question, newOptions, nusOnly);
  }

  function handleEditOption(event, option) {
    event.preventDefault();
    const newOptions = options.map((o) => (o.id === option.id ? option : o));
    setOptions(newOptions);
    editPoll(question, newOptions, nusOnly);
  }

  function optionValidator(option) {
    return (
      option.description.length > 50 ||
      option.description === "" ||
      options.filter((opt) => opt.description === option.description).length > 1
    );
  }

  function optionHelperText(option) {
    if (option.description.length > 50) {
      return "Maximum characters (50) exceeded";
    } else if (option.description === "") {
      return "Option cannot be left empty";
    } else if (
      options.filter((opt) => opt.description === option.description).length > 1
    ) {
      return "Duplicated options are not supported";
    } else if (option.description.length > 40) {
      return option.description.length + " / 50";
    }
    return "";
  }

  function questionValidator(question) {
    return question === "" || question.length > 200;
  }

  function questionHelperText() {
    if (question === "") {
      return "Question cannot be left empty";
    } else if (question.length > 200) {
      return "Maximum characters (200) exceeded";
    } else if (question.length > 190) {
      return question.length + " / 200";
    }
    return "";
  }

  function validation(question) {
    return (
      options.length > 1 &&
      !questionValidator(question) &&
      options.every((opt) => !optionValidator(opt))
    );
  }

  function creator() {
    return (
      <>
        <GridPoll
          textField={
            <TextField
              multiline
              placeholder={"Poll"}
              value={question}
              error={questionValidator(question)}
              helperText={questionHelperText(question)}
              fullWidth
              onChange={(event) => handleEditPoll(event, event.target.value)}
              inputProps={{
                style: {
                  fontSize: 14,
                  fontWeight: "bold",
                },
              }} // font size of input text
            />
          }
          button={deleteButton()}
        />
        {options.map((option) => (
          <GridPoll
            key={option.id}
            textField={
              <TextField
                placeholder={"Option " + (option.id + 1)}
                error={optionValidator(option)}
                helperText={optionHelperText(option)}
                fullWidth
                value={option.description}
                onChange={(event) => {
                  handleEditOption(event, {
                    id: option.id,
                    description: event.target.value,
                  });
                }}
                inputProps={{ style: { fontSize: 14 } }} // font size of input text
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
                  <ClearIcon />
                </IconButton>
              </form>
            }
            row={true}
          />
        ))}

        {options.length > 20 ? (
          <GridPoll
            textField={
              <Typography variant="subtitle1">
                Maximum number of options (20) reached
              </Typography>
            }
          />
        ) : (
          <form onSubmit={handleAddOption}>
            <GridPoll
              textField={
                <TextField
                  size="small"
                  placeholder="Add Option"
                  fullWidth
                  value={newOptionText}
                  onChange={(event) => setNewOptionText(event.target.value)}
                  autoFocus={true}
                  inputProps={{ style: { fontSize: 14 } }} // font size of input text
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
        )}
      </>
    );
  }

  function previewer() {
    return (
      <>
        <Typography className={styles.row} variant="body2" align="justify">
          {poll.description}
        </Typography>
        <RadioGroup
          aria-label={poll.description}
          name={poll.description}
          value={value}
          onChange={handleChange}
        >
          <List
            disablePadding
            dense
            style={{ marginLeft: "-16px", marginRight: "-16px" }}
          >
            {poll.options.map((option) => (
              <ListItem
                key={option.id}
                button
                disableRipple={true}
                disableTouchRipple={true}
                disableGutters
              >
                <FormControlLabel
                  style={{ paddingLeft: "16px", paddingRight: "16px" }}
                  value={option.description}
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" className={styles.description}>
                      {option.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
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
            {nusOnlySwitch()}
            <ButtonGroup>
              {saveButton()}
              {submitButton()}
            </ButtonGroup>
          </>
        }
      />
    </>
  );
}

export default Poll;
