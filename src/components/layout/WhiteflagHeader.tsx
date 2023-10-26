import { useContext, useEffect, useState } from "react";
import { Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import WhiteFlagContext from "../../helpers/Context";

export const WhiteflagHeader: React.FC = () => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [lastUpdate, setLastUpdate] = useState<dayjs.Dayjs>(null);
  const ctx = useContext(WhiteFlagContext);
  window.addEventListener("offline", () => {
    setOnline(false);
    setLastUpdate(dayjs());
  });

  window.addEventListener("online", () => {
    setOnline(true);
  });

  useEffect(() => {
    setLastUpdate(dayjs());
  }, [ctx.whiteflagSignals]);

  return (
    <div>
      <div
        style={{
          overflow: "initial",
          top: "0px",
          height: "26px",
          width: "100%",
          textAlign: "left",
          position: "fixed",
        }}
      >
        {online ? (
          <div
            style={{
              backgroundColor: "#1C1F22",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div
              style={{
                marginLeft: "16px",
                background: "#29B05F",
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
              }}
            />
            <Typography.Text
              style={{ color: "white", marginLeft: "6px", fontSize: "14px" }}
            >
              Online
            </Typography.Text>{" "}
            <Typography.Text
              style={{
                position: "absolute",
                marginLeft: "auto",
                right: "16px",
                color: "#FFFFFF85",
                fontSize: "14px",
              }}
            >
              Last refreshed: {lastUpdate?.format("h:mm")}
            </Typography.Text>
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
