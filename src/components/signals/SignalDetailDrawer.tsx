import { CompassOutlined } from "@ant-design/icons";
import { Collapse, CollapseProps, Drawer, Row, Typography } from "antd";
import { Children, Dispatch, SetStateAction, useEffect } from "react";
import config from "../../config.json";
import { useApi } from "../../hooks/useApi";
import { Signal } from "../../models/Signal";
import _ from "lodash";
import { getDifferences } from "../../helpers/ChangeHelper";
import dayjs from "dayjs";

interface HistoricChanges {
  oldObject: Signal;
  newObject: Signal;
  changedProperties: Partial<Signal>;
}

const panelStyle = {
  marginBottom: 24,
  border: "none",
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

  console.log(signalHistoriesFromNewToOld);

  const histories = signalHistoriesFromNewToOld
    .map((signalHistory, index) => {
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
    })
    .filter((h) => !_.isNil(h.changedProperties));

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
    children: <>{history.oldObject.name}</>,
    style: panelStyle,
  }));
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
