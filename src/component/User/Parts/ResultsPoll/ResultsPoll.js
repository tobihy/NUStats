import React, { useState } from "react";
import { Tabs, Tab } from "@material-ui/core";
import BarGraph from "./BarGraph";
import PieGraph from "./PieGraph";
import BarChartIcon from "@material-ui/icons/BarChart";
import PieChartIcon from "@material-ui/icons/PieChart";
import styles from "./ResultsPoll.module.css";

function ResultsPoll(props) {
  const [view, setView] = useState(0);
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
  return (
    <div>
      {poll.pollCount !== 0 && (
        <>
          <Tabs
            value={view}
            onChange={(event, newValue) => setView(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            centered
          >
            <Tab icon={<BarChartIcon className={styles.rotate} />} />
            <Tab icon={<PieChartIcon />} />
          </Tabs>
          <div>{!view ? barGraph() : pieGraph()}</div>
        </>
      )}
    </div>
  );
}

export default ResultsPoll;
