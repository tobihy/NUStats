import React, { useState } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import Rectangle from "../../UI/Rectangle/Rectangle";
import styles from "./PollPreview.module.css";

function PollPreview(props) {
  const { poll } = props;
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Rectangle>
      <h2 className={styles.qns}>{poll.description}</h2>
      <RadioGroup
        aria-label={poll.description}
        name={poll.description}
        value={value}
        onChange={handleChange}
        className={styles.opts}
      >
        {poll.options.map((option) => (
          <FormControlLabel
            key={option.id}
            className={styles.opts}
            value={option.description}
            control={<Radio />}
            label={option.description}
          />
        ))}
      </RadioGroup>
    </Rectangle>
  );
}

export default PollPreview;
