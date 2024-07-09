import {
  CompassOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Card, Col, List, Row, Typography, Button } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config.json";
import WhiteFlagContext from "../../helpers/Context";
import { useApi } from "../../hooks/useApi";
import { DecodedSignal } from "../../models/DecodedSignal";
import {
  InfrastructureSubjectCode,
  WhiteflagResponse,
  WhiteflagSignal,
} from "../../models/WhiteflagSignal";
import { Settings } from "../../utilities/Settings";
import { SetLocationModal } from "../LocationModal/SetLocationModal";
import CoordinatesHeader from "../layout/CoordinatesHeader";
import PageToggle from "../layout/PageToggle";
import { AddSignalDrawer } from "./AddSignalDrawer";
import { SignalDetailDrawer } from "./SignalDetailDrawer";
import { SignalBodyText } from "../../models/SignalBodyText";
export interface Location {
  latitude?: number;
  longitude?: number;
}

export const SignalsList: React.FC = () => {
  const navigate = useNavigate();
  const ctx = useContext(WhiteFlagContext);
  const [locationModalVisable, setLocationModalVisable] = useState<boolean>(false);
  const [newSignalDrawerOpen, setNewSignalDrawerOpen] = useState<boolean>(false);
  const [activeSignal, setActiveSignal] = useState<DecodedSignal>();
  const [distanceToSignal, setDistanceToSignal] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    entities: signalResponses,
    endpoints: signalsEndpoint,
    loading: isLoadingSignals,
    error: signalsError
  } = useApi<WhiteflagSignal, WhiteflagResponse>({
    url: `${config.baseUrl}${Settings.endpoints.signals.get}`,
  });

  const {
    endpoints: decodeListEndpoint,
    loading: isLoadingDecodeList,
    error: decodeListError
  } = useApi<WhiteflagResponse[]>({
    url: `${config.baseUrl}${Settings.endpoints.whiteflag.decodeList}`,
  });

  useEffect(() => {
    signalsEndpoint.getAll();
    if (ctx?.whiteflagSignals?.length > 0) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (signalResponses && !_.isEmpty(signalResponses)) {
      getAllSignals();
    }
  }, [signalResponses]);

  useEffect(() => {
    if (ctx.activeSignal) {
      setActiveSignal(ctx.activeSignal);
    } else {
      setActiveSignal(null);
    }
  }, [ctx.activeSignal]);

  useEffect(() => {
    if (ctx.distanceToSignal) {
      setDistanceToSignal(ctx.distanceToSignal);
    } else {
      setDistanceToSignal(null);
    }
  }, [ctx.distanceToSignal]);

  useEffect(() => {
    ctx.setLastPage(window.location.pathname);
  }, [ctx]);

  // useEffect(() => {
  //   // sync signals in queue
  //   navigator.serviceWorker.controller.postMessage({
  //     action: "resyncQueue",
  //     transfer: localStorage.getItem("token"),
  //   });
  // }, []);

  const getAllSignals = async () => {
    if (!ctx.whiteflagSignals) {
      setIsLoading(true);
    }
    const ids = signalResponses
      .map((response) => response.id);
    const whiteflagResponse = await decodeListEndpoint.directPost({
      signals: ids,
    });

    if (whiteflagResponse) {
      ctx.whiteFlagHandler(
        whiteflagResponse.map(
          (response) => response as unknown as DecodedSignal
        )
      );
      setIsLoading(false);
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      ctx.locationHandler({ latitude, longitude });
    });
  };

  const referenceTextSignalIds = useMemo(() => {
    return ctx?.whiteflagSignals
      .filter((signal) => !_.isNil(signal.signal_body.text))
      .flatMap((signal) =>
        signal?.references.flatMap((referenceSignal) => referenceSignal.id)
      );
  }, [ctx?.whiteflagSignals]);

  useEffect(() => {
    if (referenceTextSignalIds && ctx.whiteflagSignals) {
      ctx.filteredWhiteflagSignalsHandler(
        ctx.whiteflagSignals
          .map((response) => response as unknown as DecodedSignal)
          ?.filter((signal) => signalExistAsReferenceOfTextSignal(signal))
          ?.sort(ctx.compareDistances)
      );
    }
  }, [referenceTextSignalIds, ctx.whiteflagSignals]);

  const signalExistAsReferenceOfTextSignal = (
    signal: DecodedSignal
  ): boolean => {
    return !referenceTextSignalIds?.includes(signal.id);
  };

  const validSignals = useMemo(() => {
    const signalsWithValidCoordinates = ctx?.filteredWhiteflagTextSignals.filter(signal => {
      const coordinates = ctx.extractCoordinates(signal);
      return coordinates !== null;
  });

    const sortedSignals = signalsWithValidCoordinates.sort(ctx.compareDistances)

    return sortedSignals
  }, [ctx?.filteredWhiteflagTextSignals, ctx.location]);

  useEffect(() => {
    ctx.setValidSignals(validSignals);
  }, [validSignals, ctx.setValidSignals]);
  
  return (
    <React.Fragment>
      <CoordinatesHeader />
      {ctx.location.latitude !== 0 && ctx.location.longitude !== 0 && (
        <React.Fragment>
          <Row
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
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
                {validSignals?.length} Nearby flags
              </Typography.Title>
            </Col>
            <Col
              style={{
                paddingRight: "16px",
                display: "flex",
                alignItems: "center",
                color: "#FFFFFF",
                cursor: "pointer"
              }}
              onClick={() => {
                getAllSignals();
                setIsLoading(true);
              }}
            >
              <ReloadOutlined
                style={{
                  color: "#FFFFFF",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              />
              <span style={{ paddingLeft: "5px", fontSize: "14px" }}>
                Refresh
              </span>
            </Col>
          </Row>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
            }}
            loading={isLoadingSignals || isLoadingDecodeList}
            dataSource={validSignals}
            style={{ width: "100%" }}
            renderItem={(signal) => {
              const { latitude, longitude } = ctx.extractCoordinates(signal);
              const bearing = ctx.calculateBearing(signal);
              const subjectCodeIndex = Object.values(
                InfrastructureSubjectCode
              ).indexOf(signal.signal_body.subjectCode);

              const texts = signal?.signal_body?.text
                ? (JSON.parse(signal.signal_body.text) as SignalBodyText)
                : undefined;

              return (
                <List.Item>
                  <Card
                    hoverable
                    bordered={false}
                    bodyStyle={{ padding: "16px" }}
                    style={{
                      marginLeft: "16px",
                      marginRight: "16px",
                    }}
                    onClick={() => ctx.handleSignalSelect(signal)}
                  >
                    <Row>
                      <Typography.Text
                        type={"secondary"}
                        style={{ color: "#FFFFFF", fontSize: "18px" }}
                      >
                        {
                          Object.keys(InfrastructureSubjectCode)[
                            subjectCodeIndex
                          ]
                        }
                      </Typography.Text>
                    </Row>
                    <Row>
                      <Typography.Title
                        level={1}
                        style={{ fontWeight: "normal", marginTop: "0px" }}
                      >
                        {texts?.name}
                      </Typography.Title>
                    </Row>
                    <Row style={{ display: "flex" }}>
                      <CompassOutlined
                        style={{
                          paddingRight: "10px",
                          height: "24px",
                          width: "24px",
                        }}
                      />
                      <div>
                        <Row>
                          <Typography.Text style={{ marginTop: "0px" }}>
                            {bearing
                              ? `${ctx.calculateDistanceToSignal(ctx.extractCoordinates(signal)
                                  )?.toFixed(2)} km · ${bearing?.toFixed(
                                  0
                                )}° ${ctx.getCompassDirection(bearing!)}`
                              : "Provide reference location"}
                          </Typography.Text>
                        </Row>
                        <Row>
                          <Typography.Text
                            type={"secondary"}
                            style={{ color: "#FFFFFF" }}
                          >
                            {`${
                              latitude
                                ? Number.parseFloat(
                                  latitude
                                  )?.toFixed(8)
                                : 0
                            }, ${
                              longitude
                                ? Number.parseFloat(
                                  longitude
                                  )?.toFixed(8)
                                : 0
                            }`}
                          </Typography.Text>
                        </Row>
                      </div>
                    </Row>
                    <div style={{ paddingTop: "16px" }}>
                      <Row>
                        <Typography.Text
                          type={"secondary"}
                          style={{ color: "#FFFFFF" }}
                        >
                          Uploaded by
                        </Typography.Text>
                      </Row>
                      <Row>
                        <Typography.Text>
                          {signal.sender.username}
                        </Typography.Text>
                      </Row>
                    </div>
                    <div style={{ paddingTop: "16px" }}>
                      <Row>
                        <Typography.Text
                          type={"secondary"}
                          style={{ color: "#FFFFFF" }}
                        >
                          Last updated
                        </Typography.Text>
                      </Row>
                      <Row>
                        <Typography.Text>
                          {dayjs(signal?.timestamp).format(
                            "D MMMM YYYY, HH:mm"
                          )}
                        </Typography.Text>
                      </Row>
                      <Row>
                        <Typography.Text>{`by ${signal.sender.username}`}</Typography.Text>
                      </Row>
                    </div>
                    <Row>
                      <Button
                        type="default"
                        style={{
                          display: "block",
                          borderRadius: "16px",
                          fontWeight: 500,
                          marginTop: "15px",
                          backgroundColor: "#FFFFFF00",
                          borderColor: "#FFFFFF",
                          color: "#FFFFFF",
                          marginRight: "12px",
                        }}
                        onClick={() => {
                          ctx.mapNavigationHandler(Number.parseFloat(latitude).toFixed(8), Number.parseFloat(longitude).toFixed(8));
                          ctx.activeSignalHandler(signal);
                          navigate("/maps");
                        }}>
                        Show on map
                      </Button>
                      <Button
                        type="default"
                        style={{
                          display: "block",
                          borderRadius: "16px",
                          fontWeight: 500,
                          marginTop: "15px",
                          backgroundColor: "#FFFFFF00",
                          borderColor: "#FFFFFF",
                          color: "#FFFFFF",
                        }}
                        icon={<EnvironmentOutlined />}
                        href={`https://www.google.com/maps/dir/${ctx.location.latitude},${ctx.location.longitude}/${latitude},${longitude}`}
                        target="_blank"
                        >
                          Show route
                      </Button>
                    </Row>
                  </Card>
                </List.Item>
              );
            }}
          />
          <SetLocationModal
            location={ctx.location}
            setLocation={ctx.locationHandler}
            setCurrentLocation={getLocation}
            open={locationModalVisable}
            setOpen={setLocationModalVisable}
          />
          {activeSignal && (
            <SignalDetailDrawer
              bearing={ctx.calculateBearing(activeSignal)!}
              open={_.isUndefined(activeSignal) ? false : true}
              setOpen={setActiveSignal}
              signal={activeSignal}
              distanceToSignal={distanceToSignal}
              compassDirection={ctx.getCompassDirection(
                ctx.calculateBearing(activeSignal)
              )}
            />
          )}
        </React.Fragment>
      )}
      {!newSignalDrawerOpen && (
        <PageToggle setNewSignalDrawerOpen={setNewSignalDrawerOpen} />
      )}
      <AddSignalDrawer
        open={newSignalDrawerOpen}
        setOpen={setNewSignalDrawerOpen}
        signalsEndpoint={signalsEndpoint}
      />
    </React.Fragment>
  );
};
