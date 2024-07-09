import { useNavigate } from "react-router-dom";
import { CompassOutlined, RightOutlined } from "@ant-design/icons";
import { Collapse, CollapseProps, Drawer, Row, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useContext } from "react";
import config from "../../config.json";
import { getDifferences } from "../../helpers/ChangeHelper";
import { useApi } from "../../hooks/useApi";
import { DecodedSignal } from "../../models/DecodedSignal";
import { Signal } from "../../models/Signal";
import { InfrastructureSubjectCode } from "../../models/WhiteflagSignal";
import { SignalBodyText } from "../../models/SignalBodyText";
import WhiteFlagContext from "../../helpers/Context";
import _ from "lodash";

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

const ignoredKeys = ["id", "lastUpdate", "lastUpdateBy"];

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
  const changedKeys = history.changedProperties
    ? Object.keys(history.changedProperties)
    : [];

  return (
    <>
      {Object.keys(history.oldObject).map((objectKey, index) => {
        if (!ignoredKeys.includes(objectKey)) {
          return (
            <div
              style={{
                marginBottom:
                  index < Object.keys(history.oldObject).length - 1
                    ? "12px"
                    : "0px",
              }}
            >
              {createHistoryProperty(
                history,
                changedKeys,
                objectKey as keyof Signal
              )}
            </div>
          );
        }
      })}
    </>
  );
};

const createHistoryProperty = (
  history: HistoricChanges,
  changedKeys: string[],
  objectKey: keyof Signal
): JSX.Element => {
  return (
    <>
      <Row>
        <Typography.Text type="secondary">
          {objectKey.replace(/^\w/, (c) => c.toUpperCase())}
        </Typography.Text>
      </Row>
      <Row>
        {changedKeys?.includes(objectKey) ? (
          <>
            {history.newObject[objectKey]}
            <Tag
              color="#9FA3AD"
              style={{
                marginRight: "0px",
                marginLeft: "auto",
                borderRadius: "16px",
                color: "#090A0B",
                fontSize: "10px",
              }}
            >
              changed
            </Tag>
          </>
        ) : (
          history.newObject[objectKey]
        )}
      </Row>
    </>
  );
};

interface Props {
  bearing: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<DecodedSignal | undefined>>;
  signal: DecodedSignal | undefined;
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
  const navigate = useNavigate();
  const ctx = useContext(WhiteFlagContext);
  const {
    entities: signalsHistories,
    endpoints: signalHistoryEndpoint,
    loading: isLoadingSignalHistories,
    error: signalHistoriesError,
  } = useApi<Signal>({ url: `${config.baseUrl}/history-signals` });

  const texts = signal?.signal_body?.text
    ? (JSON.parse(signal.signal_body.text) as SignalBodyText)
    : undefined;

  const infrastructureSignal = !_.isUndefined(texts)
    ? signal.references?.[0]
    : signal;

  return (
    <Drawer
      title={
        <>
          <Row>{texts?.name}</Row>
          <Row>
            <Typography.Text type={"secondary"}>
              Infrastructure ·{" "}
              {
                Object.keys(InfrastructureSubjectCode)[
                  Object.values(InfrastructureSubjectCode).indexOf(
                    infrastructureSignal.signal_body?.subjectCode
                  )
                ]
              }
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
        navigate(ctx.lastPage);
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
        <Typography.Text type={"secondary"}>{`${(infrastructureSignal
          ?.signal_body?.objectLatitude
          ? Number.parseFloat(infrastructureSignal?.signal_body?.objectLatitude)
          : 0
        ).toFixed(8)}, ${(infrastructureSignal?.signal_body?.objectLongitude
          ? Number.parseFloat(
              infrastructureSignal?.signal_body?.objectLongitude
            )
          : 0
        ).toFixed(8)}`}</Typography.Text>
      </Row>
      <Row>
        <Typography.Title level={4}>Notes</Typography.Title>
      </Row>
      <Row>
        {
          <Typography.Text type={"secondary"}>
            {texts?.text ?? "No data"}
          </Typography.Text>
        }
      </Row>
      <Row>
        <Typography.Title level={4}>Update history</Typography.Title>
      </Row>
      <Row>
        {!_.isEmpty(signalsHistories) ? (
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
