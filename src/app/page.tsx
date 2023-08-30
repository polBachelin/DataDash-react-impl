'use client';
import ChartComponent from '@/components/Chart';
import ChartRenderer from '@/components/ChartRenderer';
import DashboardItem from '@/components/DashboardItem';
import Dashboard from '@/components/Dashboard';
import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Spin, Typography } from "antd";
import Link from "next/link";
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from './page.module.css';
import { deserialize } from 'v8';
import { Layout } from 'react-grid-layout';
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
  timeDimensions: TimeDimension[];
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
    filters: [],
    timeDimensions: [],
    limit: 10000,
    offset: 0,
    order: []}, 
  chartType: "bar"}

  const defaultVisLine: VisState = {query: 
    {
      measures: ["Sale.count"],
      dimensions: ["Status_name.name"],
      filters: [],
      timeDimensions: [],
      limit: 10000,
      offset: 0,
      order: []}, 
    chartType: "line"}
const defaultLayout = (i: any) => ({
    x: i.x || 0,
    y: i.y || 0,
    w: i.w || 4,
    h: i.h || 8,
    minW: 4,
    minH: 8
});

interface DashboardItem {
  layout: string,
  vizState: string,
  id: string,
  name: string
}

const l: Layout = {
  i: "key",
  x: 0,
  y: 0,
  w: 12,
  h: 8
}

const l2: Layout = {
  i: "another",
  x: 12,
  y: 8,
  w: 6,
  h: 8
}


const dashItem: DashboardItem = {
  layout: '{\"i\":\"key\",\"x\":0,\"y\":0,\"w\":12,\"h\":8}',
  vizState: JSON.stringify(defaultVis),
  id: "firstItem",
  name: "Sales count bar chart"
}

const dashItem2: DashboardItem = {
  layout: '{\"i\":\"another\",\"x\":12,\"y\":8,\"w\":6,\"h\":8}',
  vizState: JSON.stringify(defaultVisLine),
  id: "secondItem",
  name: "Sales count bar chart"
}
const defaultDash: Array<DashboardItem> = [dashItem, dashItem2]

interface DashboardData {
  dashboardItems: Array<DashboardItem>
}

//todo change to JSON parse when you retrieve the data from backend
const deserializeItem = (i: any) => ({
  ...i,
  layout: JSON.parse(i.layout) || {},
  vizState: JSON.parse(i.vizState)
});

export default function Home() {
  //TODO data retrieved from backend
  const [data, setData] = React.useState<DashboardData>({dashboardItems: defaultDash});
  const [loading, isLoading] = React.useState<boolean>(false);

  if (loading) {
    return <Spin/>;
  }

  const dashboardItem = (item: DashboardItem) => (
    <div key={item.id} data-grid={defaultLayout(item.layout)}>
      <DashboardItem key={item.id} title={item.name}>
        <ChartRenderer vizState={item.vizState} chartHeight={100}/>
      </DashboardItem>
    </div>
  );
  
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
	console.log(data.dashboardItems)
  return !data || data?.dashboardItems.length ? (
    <main>
      <div>
        <Dashboard dashboardItems={data && data.dashboardItems}>
          {data && data.dashboardItems.map(deserializeItem).map(dashboardItem)}
        </Dashboard>
      </div>
    </main>
  ) : <Empty/>;
}
