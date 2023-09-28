import { useState } from "react";
import { Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export const WhiteflagHeader: React.FC = () => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [lastUpdate, setLastUpdate] = useState<dayjs.Dayjs>(null);

  window.addEventListener("offline", () => {
    setOnline(false);
    setLastUpdate(dayjs());
  });

  window.addEventListener("online", () => {
    setOnline(true);
  });

  return (
    <div>
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
              backgroundColor: "#1C1F22",
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
              You're offline
            </Typography.Text>
            <Typography.Text
              style={{
                position: "absolute",
                marginLeft: "auto",
                right: "6px",
              }}
            >
              Last update: {lastUpdate?.format("DD/MM/YYYY, h:mm")}
            </Typography.Text>
          </div>
        )}
      </div>
    </div>
  );
};
