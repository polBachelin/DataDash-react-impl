'use client';
import React from "react";
import { Card, Menu , Dropdown, Modal } from "antd";
import styled from 'styled-components';
import { useMutation } from "@apollo/react-hooks";
import Link from "next/link";

const StyledCard = styled(Card)`
  box-shadow: 0px 2px 4px rgba(141, 149, 166, 0.1);
  border-radius: 4px;

  .ant-card-head {
    border: none;
  }
  .ant-card-body {
    padding-top: 12px;
  }
`


interface DashboardItemProps {
    children: any,
    title: any
}

const DashboardItem: React.FC<DashboardItemProps> = ({ children, title }) => (
    <StyledCard
      title={title}
      bordered={false}
      style={{
        height: "100%",
        width: "100%"
      }}
    >
      {children}
    </StyledCard>
);

export default DashboardItem;