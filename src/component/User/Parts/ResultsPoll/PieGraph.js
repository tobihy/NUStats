import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import styles from "./ResultsPoll.module.css";
import { Paper, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

function PieGraph(props) {
  const filteredData = props.data.filter(
    (entry) => entry["Number of Responses"] !== 0
  );
  const theme = useTheme();
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
        fill={theme.palette.text.primary}
        textAnchor={x > cx ? "start" : "end"}
        verticalanchor="start"
        dominantBaseline="central"
        width={25}
      >
        {filteredData[index].name.length > 18
          ? filteredData[index].name.substring(0, 15) + "..."
          : filteredData[index].name}
        : {value} {" ("}
        {((value / props.total) * 100).toFixed(0)}
        {"%)"}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper variant="outlined" square style={{ padding: "0.5rem" }}>
          <Typography variant="subtitle2">{payload[0].name}</Typography>
          <Typography variant="body2">{`Number of responses : ${payload[0].value}`}</Typography>
        </Paper>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer height={300} width="95%">
      <PieChart height={250}>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          startAngle={45}
          endAngle={405}
          outerRadius={80}
          fill={theme.palette.text.primary}
          dataKey={props.variable}
          label={label}
          className={styles.pieWrapper}
        >
          {filteredData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                props.completed && entry === props.data[props.optionId]
                  ? theme.palette.primary.dark
                  : theme.palette.primary.light
              }
            />
          ))}
        </Pie>
        <Tooltip
          // contentStyle={{
          //   color: theme.palette.text.primary,
          //   backgroundColor: theme.palette.background.paper,
          // }}
          // itemStyle={{ color: theme.palette.text.primary }}
          // cursor={{ fill: theme.palette.background.paper }}
          content={CustomTooltip}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieGraph;
