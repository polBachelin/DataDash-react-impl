import { useMutation } from "@apollo/react-hooks";
import React, { useEffect, useState } from 'react';
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styled from 'styled-components';
import dragBackground from './drag-background.svg';
const ReactGridLayout = WidthProvider(RGL);

const DragField = styled(ReactGridLayout)`
  margin: 16px 28px 100px 28px;
      background: url(${dragBackground});
    background-repeat: repeat-y;
    background-position: 0px -4px;
    background-size: 100% 52px;
`
interface DragFieldProps {
	margin: any,
	containerPadding: any
	onDragStart: any,
	onDragStop: any,
	onResizeStart: any,
	onResizeStop: any,
	cols: any,
	rowHeight: any,
	onLayoutChange: any,
	isDragging: boolean
}

interface DashboardProps {
    children: any,
    dashboardItems: any
}

const Dashboard: React.FC<DashboardProps> = ({ children, dashboardItems }) => {
	const [isDragging, setIsDragging] = useState(false);
    //const [updateDashboardItem] = useMutation(); //TODO connect to backend to retrieve dashboard

	const onLayoutChange = (newLayout: any) => {
		newLayout.forEach((l: any) => {
		  const item = dashboardItems.find((i: any) => i.id.toString() === l.i);
		  const toUpdate = JSON.stringify({
			x: l.x,
			y: l.y,
			w: l.w,
			h: l.h
		  });
	
		//   if (item && toUpdate !== item.layout) {
		// 	updateDashboardItem({
		// 	  variables: {
		// 		id: item.id,
		// 		input: {
		// 		  layout: toUpdate
		// 		}
		// 	  }
		// 	});
		//   }
		});
	  };

	return (
		<DragField
			margin={[12, 12]}
			containerPadding={[0, 0]}
			onDragStart={() => setIsDragging(true)}
			onDragStop={() => setIsDragging(false)}
			onResizeStart={() => setIsDragging(true)}
			onResizeStop={() => setIsDragging(false)}
			cols={24}
			rowHeight={20}
			onLayoutChange={onLayoutChange}
		>
		{children}
		</DragField>
	)
}

export default Dashboard;