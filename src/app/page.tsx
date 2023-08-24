'use client';
import ChartComponent from '@/components/Chart';
import ChartRenderer from '@/components/ChartRenderer';
import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Spin, Typography } from "antd";
import Link from "next/link";
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from './page.module.css';

interface ChartDataItem {
	name: string;
	value: number;
}


const chartData: ChartDataItem[]  = 
[{
  name: 'Bar 1',
  value: 10
},
{
  name: 'Bar 2',
  value: 14
},
{
  name: 'Bar 3',
  value: 40
}]

const chartObject= {

}

interface Filter {
  member: string;
  operator: string;
  values: string[];
}

interface TimeDimension {
  dimension: string;
  date_range: string[];
  granularity: string;
}

interface Query {
  measures: string[];
  dimensions: string[];
  filters: Filter[];
  time_dimensions: TimeDimension[];
  limit: number;
  offset: number;
  order: [string, string][];
}

interface VisState {
  query: Query;
  chartType: string;
}

const defaultVis: VisState = {query: 
  {
    measures: ["Sale.count"],
    dimensions: ["Status_name.name"],
    filters: [{
      member: "Sale.amount",
      operator: "gt",
      values: ["5000"]
    }],
    time_dimensions: [],
    limit: 10000,
    offset: 0,
    order: [["Sale.amount", "asc"]]}, 
  chartType: "line"}

export default function Home() {
  const [data, setData] = React.useState<any[]>(["data", "data"]);
  const [loading, isLoading] = React.useState<boolean>(false);

  if (loading) {
    return <Spin/>;
  }
  
  const Empty = () => (
    <div
      style={{
        textAlign: "center",
        padding: 12
      }}
    >
      <h2>There are no charts on this dashboard</h2>
      <Link href="/explore">
        <Button type="primary" size="large">
          <PlusOutlined />
          Add chart
        </Button>
      </Link>
    </div>
  );

  return data.length ? (
    <main className={styles.main}>
      <div className={styles.description}>
        <ChartRenderer vizState={defaultVis} chartHeight={100}/>
      </div>
    </main>
  ) : <Empty/>;
}
