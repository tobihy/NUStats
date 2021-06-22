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
import indigo from "@material-ui/core/colors/indigo";

const dark = indigo[400];
const light = indigo[100];

let ctx;

export const measureText14HelveticaNeue = (text) => {
  if (!ctx) {
    ctx = document.createElement("canvas").getContext("2d");
    ctx.font = "14px 'Roboto";
  }

  return ctx.measureText(text).width;
};

const BAR_AXIS_SPACE = 10;

function BarGraph(props) {
  const { data, xKey, yKey, total, completed, optionId } = props;
  const maxTextWidth = useMemo(
    () =>
      data.reduce((acc, cur) => {
        const value = cur[yKey];
        const width = measureText14HelveticaNeue(
          value + " (" + ((value / total) * 100).toFixed(2) + "%)"
        );
        if (width > acc) {
          return width;
        }
        return acc;
      }, 0),
    [data, yKey, total]
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

  return (
    <ResponsiveContainer width={"100%"} height={50 * data.length} debounce={50}>
      <BarChart
        data={data}
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
          tick={{ fill: "#080808" }}
          tickFormatter={(str) =>
            str.length > 40 ? str.substring(0, 37) + "..." : str
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
            fill: "#080808",
            transform: `translate(${maxTextWidth + BAR_AXIS_SPACE}, 0)`,
          }}
        />
        <Tooltip />
        <Bar dataKey={yKey} minPointSize={2} barSize={32}>
          {data.map((d, idx) => {
            return (
              <Cell
                key={d[xKey]}
                fill={completed && idx === optionId ? dark : light}
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
