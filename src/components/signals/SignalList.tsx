import { Col, List, Row, Typography } from "antd";
import SignalCard from "./SignalCard";
import { DecodedSignal } from "../../models/DecodedSignal";
import { ReloadOutlined } from "@ant-design/icons";
import SignalSearchItem from "./SignalSearchItem";

export interface SignalListProps {
  isLoading: boolean;
  signals: DecodedSignal[];
  refreshFunc: () => void;
  className?: string;
  quickResults?: boolean;
}

export const SignalList = ({
  isLoading,
  signals,
  refreshFunc,
  className,
  quickResults,
}: SignalListProps) => {
  return (
    <div className={className}>
      {!quickResults && (
        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Col>
            <Typography.Title
              level={1}
              style={{
                fontWeight: "normal",
                margin: "0px",
                fontSize: "14px",
                textAlign: "left",
                paddingLeft: "10px",
              }}
            >
              {signals?.length} Nearby flags
            </Typography.Title>
          </Col>
          <Col
            style={{
              paddingRight: "16px",
              display: "flex",
              alignItems: "center",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
            onClick={refreshFunc}
          >
            <ReloadOutlined
              style={{
                color: "#FFFFFF",
                fontSize: "16px",
                cursor: "pointer",
              }}
            />
            <span style={{ paddingLeft: "5px", fontSize: "14px" }}>
              Refresh
            </span>
          </Col>
        </Row>
      )}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 5,
        }}
        loading={isLoading}
        dataSource={quickResults ? signals.slice(0, 3) : signals} //valid signals
        renderItem={(signal) => {
          return quickResults ? (
            <SignalSearchItem signal={signal} />
          ) : (
            <SignalCard signal={signal} />
          );
        }}
      />
    </div>
  );
};
