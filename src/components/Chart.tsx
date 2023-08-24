'use client';
import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

interface ChartDataItem {
	name: string;
	value: number;
}

interface ChartProps {
	data: ChartDataItem[];
	chartType: string;
	chartName: string;
}


const ChartComponent: React.FC<ChartProps> = ({ data, chartType, chartName }) => {
  let chart: React.ReactNode;

  switch (chartType) {
    case "bar":
      chart = (
        <BarChart width={600} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      );
      break;
    // Add cases for other chart types here

    default:
      chart = <p>Unsupported chart type</p>;
  }

  return (
    <div>
      <h2>{chartName}</h2>
      {chart}
    </div>
  );
};

export default ChartComponent;
