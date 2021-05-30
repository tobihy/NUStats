import React, { useState } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import styles from "./PollPreview.module.css";

function PollPreview(props) {
  const { poll } = props;
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <h3 className={styles.qns}>{poll.description}</h3>
      <table className={styles.table}>
        <RadioGroup
          aria-label={poll.description}
          name={poll.description}
          value={value}
          onChange={handleChange}
          className={styles.opts}
        >
          {poll.options.map((option) => (
            <tr className={styles.opts}>
              <FormControlLabel
                className={styles.opts}
                value={option.description}
                control={<Radio />}
                label={option.description}
              />
            </tr>
          ))}
        </RadioGroup>
      </table>
    </div>
  );
}

export default PollPreview;
