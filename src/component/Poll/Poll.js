import React, {useState} from "react";
import {Button, Checkbox, Paper, TextField} from "@material-ui/core";

function Poll(props) {
    const {editPoll, poll, polls, pollId} = props;
    const [question, setQuestion] = useState(poll.description);
    const [options, setOptions] = useState(poll.options);
    const [newOptionText, setNewOptionText] = useState("");
    const [optionToDelete, setOptionToDelete] = useState();

    function handleDeleteOption(event) {
        event.preventDefault();
        deleteOption(optionToDelete);
    }

    function handleAddOption(event) {
        event.preventDefault();
        addOption(newOptionText);
      }

      function deleteOption(option) {
        const newOptions = options.filter(i => i.id !== option.id);
        setOptions(newOptions);
      }

      function handleAddPoll(event) {
          event.preventDefault();
          editPoll(question, options, pollId);
      }

      function editOption(option, description) {
          const newOptions = [
              ...options.slice(0, option.id),
              {
                  id: option.id,
                  description: description,
                  selected: false
              },
              ...options.slice(option.id + 1)
          ];
          setOptions(newOptions);
      }

    function addOption(description) {
        const newOptions = [
            ...options,
            {
                id: options.length,
                description: description,
                selected: false
            }
        ];
        setOptions(newOptions);
    }
    return (
        <>
        <TextField
                    label="Question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                />
<Button type="button" variant="contained" color="primary" onClick={(event) => handleAddPoll(event)}>
                Save Question
            </Button>

        <div>
        <table style={{ margin: "0 auto", width: "100%" }}>
            {options.map((option, index) => (
                <tr key={index}>
              <Paper key={option.index}>
              <form onSubmit={handleDeleteOption}>
              <td style={{whiteSpace: "pre-wrap", overflowWrap: "break-word", width: "100%"}}>
                <p role="button" 
                onClick={() => {
                    const oldDesc = option.description;
                    const newOptionDesc = prompt("Edit Option",option.description);
                    editOption(option, newOptionDesc || oldDesc);
                }}>
                    {option.description}
                </p>
                </td>
                <td>
                <Button 
                type="submit" 
                variant="contained" 
                color="secondary"
                onClick={() => setOptionToDelete(option)}>
                Delete
            </Button>
            </td>
            </form>
                </Paper>
                </tr>
                
                ))}
                </table>
            <TextField
                    label="Option"
                    value={newOptionText}
                    onChange={(event) => setNewOptionText(event.target.value)}
                />
            <Button type="button" variant="contained" color="primary" onClick={() => addOption(newOptionText)}>
                Add Option
            </Button>
        </div>
    </>
    );
}

export default Poll;

