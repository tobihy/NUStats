import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import BarGraph from "./BarGraph";
import PieGraph from "./PieGraph";
import BarChartIcon from "@material-ui/icons/BarChart";
import PieChartIcon from "@material-ui/icons/PieChart";
import styles from "./ResultsPoll.module.css";

function ResultsPoll(props) {
  const [graph, setGraph] = useState(true);
  const { poll, data } = props;

  function barGraph() {
    return (
      <BarGraph
        data={data}
        xKey="name"
        yKey="Number of Responses"
        total={poll.pollCount}
        completed={poll.completed}
        optionId={poll.optionId}
      />
    );
  }

  function pieGraph() {
    return (
      <PieGraph
        data={data}
        variable="Number of Responses"
        total={poll.pollCount}
        completed={poll.completed}
        optionId={poll.optionId}
      />
    );
  }

  function handleSwitchGraph() {
    setGraph(!graph);
  }

  function graphButton(icon, value) {
    return (
      <IconButton
        type="button"
        variant="contained"
        color={graph === value ? "default" : "primary"}
        onClick={handleSwitchGraph}
        disabled={graph === value}
      >
        {icon}
      </IconButton>
    );
  }
  return (
    <div>
      {poll.pollCount !== 0 ? (
        <>
          {graphButton(<BarChartIcon className={styles.rotate} />, true)}
          {graphButton(<PieChartIcon />, false)}
          <div>{graph ? barGraph() : pieGraph()}</div>
          <div>Number of responses: {poll.pollCount}</div>
        </>
      ) : (
        <div>There are no responses yet.</div>
      )}
    </div>
  );
}

export default ResultsPoll;
