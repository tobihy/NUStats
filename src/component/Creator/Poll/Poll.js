import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import styles from "./Poll.module.css";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import PublishIcon from "@material-ui/icons/Publish";

function Poll(props) {
  const { editPoll, poll, polls, pollId, setPolls, setSubmittedPolls } = props;
  const [question, setQuestion] = useState(poll.description);
  const [options, setOptions] = useState(poll.options);
  const [newOptionText, setNewOptionText] = useState("");
  const [optionToDelete, setOptionToDelete] = useState();

  /* Handle Poll functions (Delete, Edit (Rename), Submit) */
  function handleDeletePoll() {
    const newPolls = polls.filter((i) => i.id !== pollId);
    newPolls.forEach((p, index) => (p.id = index));
    setPolls(newPolls);
    window.localStorage.setItem("polls", JSON.stringify(newPolls));
  }

  function handleEditPoll(event, qns) {
    event.preventDefault();
    setQuestion(qns);
    editPoll(qns, options, pollId);
  }

  function handleSubmitPoll() {
    const savedSubmittedPolls =
      JSON.parse(window.localStorage.getItem("submittedPolls")) || [];

    const newSubmittedPolls = [
      ...savedSubmittedPolls,
      {
        id: savedSubmittedPolls.length,
        description: question,
        options: options,
        responses: [],
      },
    ];
    setSubmittedPolls(newSubmittedPolls);
    const newPolls = [...polls.slice(0, pollId), ...polls.slice(pollId + 1)];
    setPolls(newPolls);
    window.localStorage.setItem(
      "submittedPolls",
      JSON.stringify(newSubmittedPolls)
    );
    window.localStorage.setItem("polls", JSON.stringify(newPolls));
    window.location.reload();
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
    <div>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <tr key={pollId + "question"} className={styles.optionDesc}>
            <td className={styles.table}>
              <TextField
                className={styles.field}
                label={"Poll " + (pollId + 1)}
                value={question}
                variant="outlined"
                fullWidth
                onChange={(event) =>
                  handleEditPoll(
                    event,
                    event.target.value || "Poll " + (pollId + 1)
                  )
                }
              />
            </td>
            <td>
              <form onSubmit={handleDeletePoll}>
                <IconButton
                  aria-label="delete"
                  type="submit"
                  size="small"
                  className={styles.icon}
                  color="secondary"
                >
                  <ClearIcon size="big" />
                </IconButton>
              </form>
              <form onSubmit={handleSubmitPoll}>
                <IconButton
                  aria-label="delete"
                  type="submit"
                  size="small"
                  className={styles.icon}
                  color="secondary"
                >
                  <PublishIcon size="big" />
                </IconButton>
              </form>
            </td>
          </tr>
          {options.map((option) => (
            <tr key={option.id} className={styles.table}>
              <div key={option.id} className={styles.table}>
                <td className={styles.table}>
                  <TextField
                    className={styles.field}
                    size="small"
                    label={"Option " + (option.id + 1)}
                    fullWidth
                    value={option.description}
                    onChange={(event) => {
                      handleEditOption(event, {
                        id: option.id,
                        description:
                          event.target.value || "Option " + (option.id + 1),
                      });
                    }}
                  />
                </td>
                <td>
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
                </td>
              </div>
            </tr>
          ))}
          <tr key="addOpt" className={styles.optionDesc}>
            <div key="addOpt" className={styles.table}>
              <nobr>
                <form
                  onSubmit={handleAddOption}
                  className={styles.forms}
                  nowrap
                >
                  <td className={styles.table}>
                    <TextField
                      className={styles.field}
                      size="small"
                      label="Add Option"
                      fullWidth
                      value={newOptionText}
                      onChange={(event) => setNewOptionText(event.target.value)}
                    />
                    <IconButton
                      aria-label="add"
                      type="submit"
                      size="small"
                      className={styles.icon}
                    >
                      <AddIcon size="big" />
                    </IconButton>
                  </td>
                </form>
              </nobr>
            </div>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Poll;
