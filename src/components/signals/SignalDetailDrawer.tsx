import { CompassOutlined, RightOutlined } from "@ant-design/icons";
import { Badge, Collapse, CollapseProps, Drawer, Row, Typography } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { Dispatch, SetStateAction, useEffect } from "react";
import config from "../../config.json";
import { getDifferences } from "../../helpers/ChangeHelper";
import { useApi } from "../../hooks/useApi";
import { Signal } from "../../models/Signal";

interface HistoricChanges {
  oldObject: Signal;
  newObject: Signal;
  changedProperties: Partial<Signal>;
}

const panelStyle = {
  marginBottom: 8,
  borderRadius: 8,
  border: "none",
  background: "#25292D",
};

const getItems = (signalsHistories: Signal[]): CollapseProps["items"] => {
  const signalHistoriesFromNewToOld = signalsHistories.sort(
    (objectA, objectB) => {
      if (dayjs(objectA.lastUpdate).isAfter(dayjs(objectB.lastUpdate))) {
        return -1;
      } else if (
        dayjs(objectA.lastUpdate).isBefore(dayjs(objectB.lastUpdate))
      ) {
        return 1;
      } else {
        return 0;
      }
    }
  );

  const histories = signalHistoriesFromNewToOld.map((signalHistory, index) => {
    const changes = getDifferences(
      signalHistory,
      index === signalHistoriesFromNewToOld.length - 1
        ? signalHistoriesFromNewToOld[index]
        : signalHistoriesFromNewToOld[index + 1]
    );

    return {
      oldObject:
        index === signalHistoriesFromNewToOld.length - 1
          ? signalHistoriesFromNewToOld[index]
          : signalHistoriesFromNewToOld[index + 1],
      newObject: signalHistory,
      changedProperties: changes,
    } as HistoricChanges;
  });

  return histories.map((history, index) => ({
    key: index,
    label: (
      <>
        <Row>
          {dayjs(history.newObject.lastUpdate).format("D MMMM YYYY, HH:mm")}
        </Row>
        <Row>
          <Typography.Text
            type={"secondary"}
          >{`by ${history.newObject.lastUpdateBy}`}</Typography.Text>
        </Row>
      </>
    ),
    children: generateHistoryCardBody(history),
    style: panelStyle,
  }));
};

const generateHistoryCardBody = (history: HistoricChanges): any => {
  // console.log(Object.keys(history.changedProperties));

  const changedKeys = history.changedProperties
    ? Object.keys(history.changedProperties)
    : [];

  return (
    <>
      <Row>
        <Typography.Text type="secondary">Old name</Typography.Text>
      </Row>
      <Badge count={changedKeys?.includes("name") ? 1 : 0}>
        <Row>{history.newObject.name}</Row>
      </Badge>
      <Row>
        <Typography.Text type="secondary">Old type</Typography.Text>
      </Row>
      <Badge count={changedKeys?.includes("type") ? 1 : 0}>
        <Row>{history.newObject.type}</Row>
      </Badge>
      <Row>
        <Typography.Text type="secondary">Old coordinates</Typography.Text>
      </Row>
      <Row>
        <Badge
          count={
            changedKeys?.includes("latitude") ||
            changedKeys?.includes("longitude")
              ? 1
              : 0
          }
        >
          {history.newObject.latitude.toFixed(8)},{" "}
          {history.newObject.longitude.toFixed(8)}
        </Badge>
      </Row>
    </>
  );
};

interface Props {
  bearing: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<Signal | undefined>>;
  signal: Signal | undefined;
  distanceToSignal: number;
  compassDirection: "N" | "E" | "S" | "W";
}

export const SignalDetailDrawer: React.FC<Props> = ({
  bearing,
  open,
  signal,
  distanceToSignal,
  compassDirection,
  setOpen,
}) => {
  const {
    entities: signalsHistories,
    endpoints: signalHistoryEndpoint,
    loading: isLoadingSignalHistories,
    error: signalHistoriesError,
  } = useApi<Signal>(`${config.baseUrl}/history-signals`);

  useEffect(() => {
    if (signal) {
      signalHistoryEndpoint.get(signal.id);
    }
  }, []);

  return (
    <Drawer
      title={
        <>
          <Row>{signal?.name}</Row>
          <Row>
            <Typography.Text type={"secondary"}>
              Infrastructure · {signal?.type}
            </Typography.Text>
          </Row>
        </>
      }
      width={"100%"}
      height={"100%"}
      open={open}
      placement={"bottom"}
      closable={true}
      onClose={() => {
        setOpen(undefined);
      }}
      destroyOnClose
    >
      <Row>
        <CompassOutlined style={{ paddingRight: "10px", color: "white" }} />
        <Typography.Text style={{ marginTop: "0px" }}>
          {`${distanceToSignal?.toFixed(2)} km · ${bearing?.toFixed(
            0
          )}° ${compassDirection}`}
        </Typography.Text>
      </Row>
      <Row>
        <Typography.Text type={"secondary"}>{`${signal?.latitude.toFixed(
          8
        )}, ${signal?.longitude.toFixed(8)}`}</Typography.Text>
      </Row>
      <Row>
        <Typography.Title level={4}>Update history</Typography.Title>
      </Row>
      <Row>
        {signalsHistories ? (
          <Collapse
            style={{ width: "100%" }}
            bordered={false}
            expandIconPosition={"end"}
            items={getItems(signalsHistories)}
            expandIcon={({ isActive }) => (
              <RightOutlined rotate={isActive ? 270 : 90} />
            )}
          />
        ) : (
          <Typography.Text type={"secondary"}>
            No update history
          </Typography.Text>
        )}
      </Row>
    </Drawer>
  );
};
