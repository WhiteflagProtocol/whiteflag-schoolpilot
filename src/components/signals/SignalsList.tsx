import {
  CompassOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Affix, Card, Col, List, Row, Typography, Button } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
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
export interface Location {
  latitude?: number;
  longitude?: number;
}

export const SignalsList: React.FC = () => {
  const navigate = useNavigate();
  const [locationModalVisable, setLocationModalVisable] =
    useState<boolean>(false);
  const ctx = useContext(WhiteFlagContext);
  // const [location, setLocation] = useState<Location>({
  //   latitude: undefined,
  //   longitude: undefined,
  // });

  const [newSignalDrawerOpen, setNewSignalDrawerOpen] =
    useState<boolean>(false);

  const [activeSignal, setActiveSignal] = useState<DecodedSignal>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    entities: signalResponses,
    endpoints: signalsEndpoint,
    loading: isLoadingSignals,
    error: signalsError,
  } = useApi<WhiteflagSignal, WhiteflagResponse>({
    url: `${config.baseUrl}${Settings.endpoints.signals.get}`,
  });

  const {
    endpoints: decodeListEndpoint,
    // loading: isLoadingDecodeList,
    error: decodeListError,
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
    if (signalResponses) {
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
  // useEffect(() => {
  //   ctx.whiteFlagHandler(whiteflagSignals);
  // }, [whiteflagSignals]);

  // useEffect(() => {
  //   ctx.locationHandler(location);
  // }, [location]);

  const getAllSignals = async () => {
    if (!ctx.whiteflagSignals) {
      setIsLoading(true);
    }
    const ids = signalResponses
      .filter((response) => response.id !== 3)
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

  const degreesToRadians = (deg: number) => {
    return (deg * Math.PI) / 180;
  };

  const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
  };

  const calculateDistanceToSignal = (signal: WhiteflagSignal) => {
    if (ctx.location?.latitude && ctx.location?.longitude) {
      const r = 6371; // Radius of the earth in km. Use 3956 for miles
      const lat1 = degreesToRadians(ctx.location?.latitude);
      const lat2 = degreesToRadians(
        signal.objectLatitude ? Number.parseFloat(signal.objectLatitude) : 0
      );
      const lon1 = degreesToRadians(ctx.location?.longitude);
      const lon2 = degreesToRadians(
        signal.objectLongitude ? Number.parseFloat(signal.objectLongitude) : 0
      );

      // Haversine formula
      const dlon = lon2 - lon1;
      const dlat = lat2 - lat1;
      const a =
        Math.pow(Math.sin(dlat / 2), 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
      const c = 2 * Math.asin(Math.sqrt(a));
      const distance = c * r;
      return distance;
    } else {
      return 0.0;
    }
  };

  const calculateBearing = (signal: WhiteflagSignal) => {
    if (ctx.location?.latitude && ctx.location?.longitude) {
      const originRadLat = degreesToRadians(ctx.location.latitude);
      const originRadLng = degreesToRadians(ctx.location.longitude);
      const targetRadLat = degreesToRadians(
        signal.objectLatitude ? Number.parseInt(signal.objectLatitude) : 0
      );
      const targetRadLng = degreesToRadians(
        signal.objectLongitude ? Number.parseInt(signal.objectLongitude) : 0
      );

      const lngDiff = targetRadLng - originRadLng;

      const y = Math.sin(lngDiff) * Math.cos(targetRadLat);
      const x =
        Math.cos(originRadLat) * Math.sin(targetRadLat) -
        Math.sin(originRadLat) * Math.cos(targetRadLat) * Math.cos(lngDiff);

      const bearingRad = Math.atan2(y, x);
      const bearingDeg = radiansToDegrees(bearingRad);

      return (bearingDeg + 360) % 360;
    } else {
      return 0.0;
    }
  };

  const getCompassDirection = (degrees: number) => {
    if (degrees >= 0 && degrees < 90) {
      return "N";
    } else if (degrees >= 90 && degrees < 180) {
      return "E";
    } else if (degrees >= 180 && degrees < 270) {
      return "S";
    } else {
      return "W";
    }
  };

  const compareDistances = (signalA: DecodedSignal, signalB: DecodedSignal) => {
    const distanceToSignalA = calculateDistanceToSignal(signalA.signal_text);
    const distanceToSignalB = calculateDistanceToSignal(signalB.signal_text);
    if (distanceToSignalA && distanceToSignalB) {
      if (distanceToSignalA < distanceToSignalB) {
        return -1;
      }
      if (distanceToSignalA > distanceToSignalB) {
        return 1;
      }
      if (distanceToSignalA === distanceToSignalB) {
        return 0;
      }
    }
    return 0;
  };

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
                {ctx?.whiteflagSignals?.length} Nearby flags
              </Typography.Title>
            </Col>
            <Col
              style={{
                paddingRight: "16px",
                display: "flex",
                alignItems: "center",
                color: "#FFFFFF",
              }}
            >
              <ReloadOutlined
                onClick={() => {
                  getAllSignals();
                  setIsLoading(true);
                }}
                style={{
                  color: "#FFFFFF",
                  fontSize: "16px",
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
            loading={isLoading}
            dataSource={ctx?.whiteflagSignals?.sort(compareDistances)}
            style={{ width: "100%" }}
            renderItem={(signal) => {
              const bearing = calculateBearing(signal.signal_text);
              const subjectCodeIndex = Object.values(
                InfrastructureSubjectCode
              ).indexOf(signal.signal_text.subjectCode);
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
                    onClick={() => setActiveSignal(signal)}
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
                        {signal.signal_text.text}Kings Academy Elementary
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
                            {`${calculateDistanceToSignal(
                              signal.signal_text
                            )?.toFixed(2)} km · ${bearing?.toFixed(
                              0
                            )}° ${getCompassDirection(bearing!)}`}
                          </Typography.Text>
                        </Row>
                        <Row>
                          <Typography.Text
                            type={"secondary"}
                            style={{ color: "#FFFFFF" }}
                          >{`${
                            signal.signal_text.objectLatitude
                              ? Number.parseFloat(
                                  signal.signal_text.objectLatitude
                                )?.toFixed(8)
                              : 0
                          }, ${
                            signal.signal_text.objectLongitude
                              ? Number.parseFloat(
                                  signal.signal_text.objectLongitude
                                )?.toFixed(8)
                              : 0
                          }`}</Typography.Text>
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
                          {dayjs(signal.timestamp).format("D MMMM YYYY, HH:mm")}
                        </Typography.Text>
                      </Row>
                      <Row>
                        <Typography.Text>{`by ${signal.sender.username}`}</Typography.Text>
                      </Row>
                    </div>
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
                      onClick={() => {
                        // relayCoordinates([signal.signal_text.objectLatitude,signal.signal_text.objectLongitude])
                        navigate("/maps");

                        ctx.mapNavigationHandler(
                          signal.signal_text.objectLatitude,
                          signal.signal_text.objectLongitude
                        );
                      }}
                    >
                      Show sign on map
                    </Button>
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
              bearing={calculateBearing(activeSignal.signal_text)!}
              open={_.isUndefined(activeSignal) ? false : true}
              setOpen={setActiveSignal}
              signal={activeSignal}
              distanceToSignal={calculateDistanceToSignal(
                activeSignal.signal_text
              )}
              compassDirection={getCompassDirection(
                calculateBearing(activeSignal.signal_text)
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
