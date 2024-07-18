import { Typography } from "antd";

interface HistoryTimelineProps {
  items: Array<{ label: string; author: string; timestamp: string }>;
}

function HistoryTimeline(props: HistoryTimelineProps) {
  return (
    <div className="history-timeline">
      <div className="history-timeline__label">
        <Typography.Text type={"secondary"}></Typography.Text>
      </div>
      <div className="history-timeline__content">
        <Typography.Text type={"secondary"}></Typography.Text>
      </div>

      {props.items.map((item) => {
        return (
          <>
            <div className="history-timeline__label">
              <Typography.Text type={"secondary"}>{item.label}</Typography.Text>
              <span className="history-timeline__indicator" />
            </div>
            <div className="history-timeline__content">
              <Typography.Text type={"secondary"}>
                {item.timestamp}
              </Typography.Text>
              <Typography.Text type={"secondary"}>
                by {item.author}
              </Typography.Text>
            </div>
          </>
        );
      })}
      {/* <Timeline
        mode="left"
        items={props.items.map((item) => {
          return {
            label: (
              <Typography.Text
                type={"secondary"}
                style={{ marginRight: "6px", width: "fit-content" }}
              >
                {item.label}
              </Typography.Text>
            ),
            children: (
              <Typography.Text type={"secondary"}>
                {item.children}
              </Typography.Text>
            ),
          };
        })}
      /> */}
    </div>
  );
}

export default HistoryTimeline;
