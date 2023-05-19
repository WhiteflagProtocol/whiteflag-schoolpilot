import { useState } from "react";
import { Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface Props {}

export const WhiteflagHeader: React.FC<Props> = ({}) => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  window.addEventListener("offline", () => {
    setOnline(false);
  });

  window.addEventListener("online", () => {
    setOnline(true);
  });

  return (
    <div
      style={{
        overflow: "initial",
        top: "0px",
        height: "16px",
        width: "100%",
        textAlign: "left",
        position: "fixed",
      }}
    >
      {online ? (
        <div
          style={{
            backgroundColor: "#4E545F",
          }}
        >
          <div
            style={{
              marginLeft: "8px",
              background: "#29B05F",
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
            }}
          />
          <Typography.Text style={{ color: "white", marginLeft: "6px" }}>
            Online
          </Typography.Text>{" "}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#e94040",
          }}
        >
          <ExclamationCircleOutlined
            style={{
              marginLeft: "8px",
              display: "inline-block",
              fontSize: "10px",
            }}
          />
          <Typography.Text style={{ marginLeft: "6px" }}>
            You're ofline
          </Typography.Text>
        </div>
      )}
    </div>
  );
};
