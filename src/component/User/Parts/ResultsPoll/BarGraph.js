import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  LabelList,
} from "recharts";
import { Paper, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { interpolateWarm } from "d3-scale-chromatic";

let ctx;

export const measureText14HelveticaNeue = (text) => {
  if (!ctx) {
    ctx = document.createElement("canvas").getContext("2d");
    ctx.font = "14px 'Poppins";
  }

  return ctx.measureText(text).width;
};

const BAR_AXIS_SPACE = 10;

function BarGraph(props) {
  const theme = useTheme();
  const { data, xKey, yKey, total, optionId } = props;

  const filteredData = props.data.map((entry, index) =>
    index === optionId
      ? {
          name: "✓ " + entry.name,
          "Number of Responses": entry["Number of Responses"],
        }
      : entry
  );

  const maxTextWidth = useMemo(
    () =>
      filteredData.reduce((acc, cur) => {
        const value = cur[yKey];
        const width = measureText14HelveticaNeue(
          value + " (" + ((value / total) * 100).toFixed(2) + "%)"
        );
        if (width > acc) {
          return width;
        }
        return acc;
      }, 0),
    [filteredData, yKey, total]
  );

  const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    const radius = 10;

    return (
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#080808"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value} {" ("} {((value / total) * 100).toFixed(0)} {"%)"}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper variant="outlined" square style={{ padding: "0.5rem" }}>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2">{`Number of responses : ${payload[0].value}`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer height={50 * data.length} width="95%">
      <BarChart
        data={filteredData}
        layout="vertical"
        margin={{ left: 10, right: maxTextWidth + (BAR_AXIS_SPACE - 8) }}
      >
        <XAxis hide axisLine={false} type="number" />
        <YAxis
          yAxisId={0}
          dataKey={xKey}
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fill: theme.palette.text.primary }}
          tickFormatter={(str) =>
            str.length > 30 ? str.substring(0, 27) + "..." : str
          }
          width={80}
        />
        <YAxis
          orientation="right"
          yAxisId={1}
          dataKey={yKey}
          type="category"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) =>
            value + " (" + ((value / total) * 100).toFixed(0) + "%)"
          }
          mirror
          tick={{
            fill: theme.palette.text.primary,
            transform: `translate(${maxTextWidth + BAR_AXIS_SPACE}, 0)`,
          }}
        />
        <Tooltip
          content={CustomTooltip}
          cursor={{ fill: theme.palette.background.paper }}
        />
        <Bar dataKey={yKey} minPointSize={2} barSize={32}>
          {filteredData.map((d, idx) => {
            return (
              <Cell
                key={d[xKey]}
                fill={interpolateWarm(idx / (2 * filteredData.length))}
              />
            );
          })}
        </Bar>
        <LabelList
          dataKey={yKey}
          content={renderCustomizedLabel}
          position="right"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarGraph;
