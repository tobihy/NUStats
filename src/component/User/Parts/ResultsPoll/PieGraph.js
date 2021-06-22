import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import styles from "./ResultsPoll.module.css";
import indigo from "@material-ui/core/colors/indigo";

const dark = indigo[500];
const light = indigo[100];

function PieGraph(props) {
  const label = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#080808"
        textAnchor={x > cx ? "start" : "end"}
        verticalanchor="start"
        dominantBaseline="central"
        width={25}
      >
        {props.data[index].name.length > 20
          ? props.data[index].name.substring(0, 17) + "..."
          : props.data[index].name}
        : {value} {" ("}
        {((value / props.total) * 100).toFixed(0)}
        {"%)"}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart height={250}>
        <Pie
          data={props.data}
          cx="50%"
          cy="50%"
          startAngle={45}
          endAngle={405}
          outerRadius={80}
          fill="#8884d8"
          dataKey={props.variable}
          label={label}
          className={styles.pieWrapper}
        >
          {props.data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={props.completed && index === props.optionId ? dark : light}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieGraph;
