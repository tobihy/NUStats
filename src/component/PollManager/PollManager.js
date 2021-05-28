import React, {useState, useEffect} from "react";
import Poll from "../Poll";
import {Button, Paper, TextField} from "@material-ui/core";

function PollManager() {
    const [polls, setPolls] = useState([]);
    const [newPollQns, setNewPollQns] = useState("");

      function deletePoll(poll) {
        const newPolls = polls.filter(i => i.id !== poll.id);
        setPolls(newPolls);
      }

    function addPoll(description, options) {
        const newPolls = [
            ...polls,
            {
                id: polls.length,
                description: description,
                options: options,
            }
        ];
        setPolls(newPolls);
        window.localStorage.setItem("polls", JSON.stringify(newPolls));
    }

    function editPoll(description, options, pollId) {
        const newPolls = [
            ...polls.slice(0, pollId),
            {
                id: pollId,
                description: description,
                options: options,
            },
            ...polls.slice(pollId+1)
        ];
        setPolls(newPolls);
        window.localStorage.setItem("polls", JSON.stringify(newPolls));
    }

    useEffect(() => {
        const savedPolls = JSON.parse(window.localStorage.getItem("polls"));
        setPolls(savedPolls ?? []);
      }, []);

    return (
        <>
            <TextField
                    label="Poll"
                    value={newPollQns}
                    onChange={(event) => setNewPollQns(event.target.value)}
                />
            <Button type="button" variant="contained" color="primary"
            onClick={() => addPoll(newPollQns, [])}>
                Add Poll
            </Button>

        <div>
        <table style={{ margin: "0 auto", width: "100%" }}>
            {polls.map((poll, index) => (
                <tr key={index}>
              <Paper key={poll.index}>
              <td style={{whiteSpace: "pre-wrap", overflowWrap: "break-word", width: "100%"}}>
                <Poll polls={polls} poll={poll} pollId={index} editPoll={editPoll}/>
                </td>
                <td>
                <Button 
                type="button" 
                variant="contained" 
                color="secondary"
                onClick={() => deletePoll(poll)}>
                Delete
            </Button>
            </td>
                </Paper>
                </tr>
                
                ))}
                </table>
                
        </div>
    </>
    );
}

export default PollManager;