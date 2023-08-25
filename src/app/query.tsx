'use client';
import axios from 'axios';
import 'chart.js/auto';
import { Chart as ChartJS } from 'chart.js/auto';
import React, { useEffect, useState } from 'react';
import { Bar, Chart } from 'react-chartjs-2';

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

interface SaleData {
	status_name: string;
	count: number;
}

interface ChartObject {
	query: Query;
	chartType: string;
	chartName: string;
}

export const fetchData = async (query: Query) => {
	try {
		const response = await axios.post('http://localhost:8080/api/v1/query', query);
		const data: any[] = await response.data;
		console.log(data)
		return data
	} catch (error) {
		console.error("Error fetching data:", error);
	}
};
