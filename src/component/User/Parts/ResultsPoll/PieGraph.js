import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import styles from "./ResultsPoll.module.css";
import { useTheme } from "@material-ui/styles";

function PieGraph(props) {
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
        {props.data[index].name.length > 18
          ? props.data[index].name.substring(0, 15) + "..."
          : props.data[index].name}
        : {value} {" ("}
        {((value / props.total) * 100).toFixed(0)}
        {"%)"}
      </text>
    );
  };

  return (
    <ResponsiveContainer height={300} width="95%">
      <PieChart height={250}>
        <Pie
          data={props.data.filter(
            (entry) => entry["Number of Responses"] !== 0
          )}
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
          {props.data.map((entry, index) => {
            if (entry["Number of Responses"] !== 0) {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    props.completed && index === props.optionId
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light
                  }
                />
              );
            }
            return null;
          })}
        </Pie>
        <Tooltip
          contentStyle={{
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          }}
          itemStyle={{ color: theme.palette.text.primary }}
          cursor={{ fill: theme.palette.background.paper }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieGraph;
