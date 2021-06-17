import React, { useState, useEffect } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  LabelList,
  Sector,
  BarChart,
  ResponsiveContainer,
} from "recharts";
import firebase from "../../../auth/AuthHook";
import { Button } from "@material-ui/core";

function SPoll(props) {
  const [data, setData] = useState([]);
  const [graph, setGraph] = useState("bar");
  const [activeIndex, setActiveIndex] = useState(0);
  const { submittedPoll } = props;

  function timestamp() {
    const dateInMillis = submittedPoll.submissionTime.seconds * 1000;
    return (
      new Date(dateInMillis).toDateString() +
      " at " +
      new Date(dateInMillis).toLocaleTimeString()
    );
  }

  function mySubmittedPoll() {
    return (
      <>
        <h2>{submittedPoll.description}</h2>
        {/* {submittedPoll.options.map((option, index) => (
          <div key={option.id}>{option.description}</div>
        ))} */}
      </>
    );
  }

  useEffect(() => {
    const tempDoc = [];
    firebase
      .firestore()
      .collection("draftSubmittedPolls")
      .doc(submittedPoll.id)
      .collection("options")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc, index) => {
          console.log(doc.data().optionCount);
          tempDoc.push({
            name: submittedPoll.options[doc.id].description,
            "Number of Responses": doc.data().optionCount,
          });
        });
        setData(tempDoc);
      });
    console.log("tempDoc", tempDoc);
  }, [submittedPoll]);

  const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    const radius = 10;

    return (
      <g>
        <text
          x={x + width / 2}
          y={y - radius}
          fill="#080808"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {value} {" ("} {((value / submittedPoll.pollCount) * 100).toFixed(2)}{" "}
          {"%)"}
        </text>
      </g>
    );
  };

  function barGraph() {
    return (
      <ResponsiveContainer aspect={1.618}>
        <BarChart width={400} height={200} data={data} stackOffset="expand">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis minTickGap="1" allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="Number of Responses" fill="#8884d8" minPointSize={5}>
            <LabelList
              dataKey="Number of Responses"
              content={renderCustomizedLabel}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  function onPieEnter(_, index) {
    setActiveIndex(index);
  }

  function pieChart() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={80}
            fill="#8884d8"
            dataKey="Number of Responses"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  function handleSwitchGraph() {
    setGraph(graph === "bar" ? "pie" : "bar");
  }

  // const renderCustomizedLabel = ({
  //   cx,
  //   cy,
  //   midAngle,
  //   innerRadius,
  //   outerRadius,
  //   percent,
  //   index,
  // }) => {
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //   const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  //   const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  //   return (
  //     <text
  //       x={x}
  //       y={y}
  //       fill="white"
  //       textAnchor={x > cx ? "start" : "end"}
  //       dominantBaseline="central"
  //     >
  //       {`${(percent * 100).toFixed(0)}%`}
  //     </text>
  //   );
  // };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {payload.name} {value}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`${(percent * 100).toFixed(2)}%`}
        </text>
      </g>
    );
  };

  return (
    <div>
      {mySubmittedPoll()}
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={handleSwitchGraph}
      >
        {graph === "bar" ? "Switch to Pie chart" : "Switch to Bar graph"}
      </Button>
      {graph === "bar" ? barGraph() : pieChart()}
      <div>Poll submitted on: {timestamp()}</div>
    </div>
  );
}

export default SPoll;
