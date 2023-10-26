import { Layout } from "antd";
import React from "react";
import { UILayout } from "./UILayout";
import { WhiteflagHeader } from "./WhiteflagHeader";

interface Props {
  children: React.ReactNode;
}

export const WhiteflagLayout: React.FC<Props> = ({ children }) => {
  return (
    <UILayout header={<WhiteflagHeader />} footer={null}>
      <div style={{ paddingTop: "30px", minHeight:"calc(100vh - 16px)" }}>{children}</div>
    </UILayout>
  );
};
