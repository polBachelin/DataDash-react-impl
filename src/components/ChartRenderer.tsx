import { fetchData } from "@/app/query";
import { ProgressResponse, ResultSet } from "@cubejs-client/core";
import { Col, Row, Spin, Statistic, Table } from "antd";
import moment from "moment";
import numeral from "numeral";
import React, { useEffect, useState } from 'react';
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts";
import styled from 'styled-components';

const numberFormatter = (item: any) => numeral(item).format("0,0");
const dateFormatter = (item: any) => moment(item).format("MMM YY");
const colors = ["#7DB3FF", "#49457B", "#FF7C78"];
const xAxisFormatter = (item: any) => {
  if (moment(item).isValid()) {
    return dateFormatter(item)
  } else {
    return item;
  }
}

interface CartesianChartProps {	
	resultSet: any,
	children: any,
	ChartComponent: any,
	height: string | number | undefined
}

const CartesianChart: React.FC<CartesianChartProps> = ({ resultSet, children, ChartComponent, height }) => (
	<ResponsiveContainer width="100%" height={height}>
	  <ChartComponent margin={{ left: -10 }} data={resultSet.chartPivot()}>
		<XAxis axisLine={false} tickLine={false} tickFormatter={xAxisFormatter} dataKey="x" minTickGap={20} />
		<YAxis axisLine={false} tickLine={false} tickFormatter={numberFormatter} />
		<CartesianGrid vertical={false} />
		{ children }
		<Legend />
		<Tooltip labelFormatter={dateFormatter} formatter={numberFormatter} />
	  </ChartComponent>
	</ResponsiveContainer>
)

interface TypeToChartProps {
	resultSet: ResultSet,
	height: string | number | undefined
}

const TypeToChartComponent: Record<string, React.FC<TypeToChartProps>> = {
  line: ({ resultSet, height }) => (
    <CartesianChart resultSet={resultSet} height={height} ChartComponent={LineChart}>
      {resultSet.seriesNames().map((series: any, i: number) => (
        <Line
          key={series.key}
          dataKey={series.key}
          name={series.title}
          stroke={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  bar: ({ resultSet, height }) => (
    <CartesianChart resultSet={resultSet} height={height} ChartComponent={BarChart}>
      {resultSet.seriesNames().map((series: any, i: number) => (
        <Bar
          key={series.key}
          stackId="a"
          dataKey={series.key}
          name={series.title}
          fill={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  area: ({ resultSet, height }) => (
    <CartesianChart resultSet={resultSet} height={height} ChartComponent={AreaChart}>
      {resultSet.seriesNames().map((series: any, i: number) => (
        <Area
          key={series.key}
          stackId="a"
          dataKey={series.key}
          name={series.title}
          stroke={colors[i]}
          fill={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  pie: ({ resultSet, height }) => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          data={resultSet.chartPivot()}
          nameKey="x"
          dataKey={resultSet.seriesNames()[0].key}
          fill="#8884d8"
        >
          {resultSet.chartPivot().map((e: any, index: number) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  ),
  table: ({ resultSet }) => (
    <Table
      pagination={false}
      columns={resultSet.tableColumns().map((c: any) => ({ ...c, dataIndex: c.key }))}
      dataSource={resultSet.tablePivot()}
    />
  ),
  number: ({ resultSet }) => (
    <Row
      justify="center"
      align="middle"
      style={{
        height: '100%',
      }}
    >
      <Col>
        {resultSet.seriesNames().map((s: any) => (
          <Statistic key={s.key} value={resultSet.totalRow()[s.key]} />
        ))}
      </Col>
    </Row>
  ),
};

const TypeToMemoChartComponent = Object.keys(TypeToChartComponent)
  .map(key => ({
    [key]: React.memo(TypeToChartComponent[key])
  }))
  .reduce((a, b) => ({ ...a, ...b }));

const SpinContainer = styled.div`
  text-align: center;
  padding: 30px 50px;
  margin-top: 30px;
`
const Spinner = () => (
  <SpinContainer>
    <Spin size="large"/>
  </SpinContainer>
)

interface ChartRendererProps {
  vizState: any;
  chartHeight: number;
}

interface RenderProps {
	resultSet: any;
	error: any;
	height: number;
	isLoading: boolean;
}
const renderChart = (Component: React.NamedExoticComponent<TypeToChartProps>) => {
	const RenderedChart: React.FC<RenderProps> = ({ resultSet, error, height, isLoading }: RenderProps) => (
		(resultSet && !isLoading && <Component height={height} resultSet={resultSet} />) ||
		(error && error.toString()) || <Spinner />
	);

	return RenderedChart
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ vizState, chartHeight }) => {

	const { query, chartType } = vizState;

	const component = TypeToMemoChartComponent[chartType];
	const [renderProps, setRenderProps] = useState({error: null, isLoading: true, resultSet: new ResultSet({})});

	useEffect(() => {
		if (renderProps.isLoading === true) {
			sendQuery(query);
		}
	})
	function sendQuery(query: any): void {
		fetchData(query).then((data) => {
			setRenderProps({error: null, isLoading: false, resultSet: new ResultSet(data)})
		}).catch((err) => {
			console.log(err);
		})
	}
	return component && renderChart(component)({ height: chartHeight, ...renderProps });
};

export default ChartRenderer;
