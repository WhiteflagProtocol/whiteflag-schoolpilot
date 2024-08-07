import { Affix, Layout } from "antd";
import React from "react";

interface Props {
  children: React.ReactNode;
  footer: React.ReactNode;
  header: React.ReactNode;
}

export const UILayout: React.FC<Props> = ({ children, footer, header }) => {
  return (
    <React.Fragment>
      <Affix offsetTop={0}>{header}</Affix>
      <Layout>
        {/* style={{ overflowY: "hidden" }} */}
        <Layout.Content
          style={{
            margin: "16px auto 0",
            maxWidth: "1600px",
            padding: "0 16px",
            minHeight: "calc(100vh - 30px)",
            width: "100vw",
            overflow: "initial",
          }}
        >
          {children}
        </Layout.Content>
        {/* <Layout.Footer style={{ backgroundColor: "white" }}>
          {footer}
        </Layout.Footer> */}
      </Layout>
    </React.Fragment>
  );
};
