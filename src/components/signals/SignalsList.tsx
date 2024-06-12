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
  const [distanceToSignal, setDistanceToSignal] = useState<number>(0);
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
      // .filter((id) => id > 130); // TODO: Remove when loading is faster
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
    return deg * (Math.PI / 180);
  };

  const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
  };

  const extractCoordinates = (signal: DecodedSignal) => {
    // First, check the main signal body
    if (signal.signal_body.objectLatitude && signal.signal_body.objectLongitude) {
        return {
            latitude: signal.signal_body.objectLatitude,
            longitude: signal.signal_body.objectLongitude
        };
    }

    // If not found directly, check the references
    const foundReference = signal.references?.find(ref => 
        ref.signal_body.objectLatitude && ref.signal_body.objectLongitude
    );
    if (foundReference) {
        return {
            latitude: foundReference.signal_body.objectLatitude,
            longitude: foundReference.signal_body.objectLongitude
        };
    }
    return null;
};

  const calculateDistanceToSignal = (coordinates: { latitude: string, longitude: string }) => {
    const { latitude, longitude } = ctx.location;
    if (latitude && longitude) {
      const r = 6371; // Radius of the earth in km. Use 3956 for miles
      const lat1 = degreesToRadians(latitude);
      const lon1 = degreesToRadians(longitude);
      
      const lat2 = degreesToRadians(coordinates?.latitude ? Number.parseFloat(coordinates.latitude) : 0);
      const lon2 = degreesToRadians(coordinates?.longitude ? Number.parseFloat(coordinates.longitude) : 0);
  
      // Haversine formula
      const dlat = lat2 - lat1;
      const dlon = lon2 - lon1;
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
  
      const targetRadLat = degreesToRadians(signal?.objectLatitude ? Number.parseFloat(signal.objectLatitude) : 0);
      const targetRadLng = degreesToRadians(signal?.objectLongitude ? Number.parseFloat(signal.objectLongitude) : 0);
  
      const lngDiff = targetRadLng - originRadLng;
  
      const y = Math.sin(lngDiff) * Math.cos(targetRadLat);
      const x =
        Math.cos(originRadLat) * Math.sin(targetRadLat) -
        Math.sin(originRadLat) * Math.cos(targetRadLat) * Math.cos(lngDiff);
  
      const bearingRad = Math.atan2(y, x); // atan2 expects angles in radians
      const bearingDeg = radiansToDegrees(bearingRad); // Convert result from radians to degrees
  
      return (bearingDeg + 360) % 360; // Normalize to 0-360
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
    const coordinatesA = extractCoordinates(signalA);
    const coordinatesB = extractCoordinates(signalB);
    if (!coordinatesA || !coordinatesB) return 0;
  
    const distanceToCoordA = calculateDistanceToSignal({
      latitude: coordinatesA.latitude,
      longitude: coordinatesA.longitude,
    });
    const distanceToCoordB = calculateDistanceToSignal({
      latitude: coordinatesB.latitude,
      longitude: coordinatesB.longitude,
    });
    return distanceToCoordA - distanceToCoordB;
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
          ?.sort(compareDistances)
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
      const coordinates = extractCoordinates(signal);
      return coordinates !== null;
  });

    // Sort these items by distance using the custom compare function and coordinates, then slice to get the top 10
    const sortedSignals = signalsWithValidCoordinates.sort(compareDistances).slice(0, 10)

    return sortedSignals
  }, [ctx?.filteredWhiteflagTextSignals, ctx.location]);
  
  const handleSignalSelect = (signal: DecodedSignal) => {
    const coordinates = extractCoordinates(signal);
    if (!coordinates) {
      console.warn("No valid coordinates available.");
      return;
    }
  
    const distance = calculateDistanceToSignal(coordinates);
    setDistanceToSignal(distance);
    setActiveSignal(signal);
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
                {validSignals?.length} Nearby flags
              </Typography.Title>
            </Col>
            <Col
              style={{
                paddingRight: "16px",
                display: "flex",
                alignItems: "center",
                color: "#FFFFFF",
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
              const { latitude, longitude } = extractCoordinates(signal);
              const bearing = calculateBearing(signal.signal_body);
              const subjectCodeIndex = Object.values(
                InfrastructureSubjectCode
              ).indexOf(signal.signal_body.subjectCode);

              const texts = signal?.signal_body?.text
                ? (JSON.parse(signal.signal_body.text) as SignalBodyText)
                : undefined;

              const infrastructureSignal = !_.isUndefined(texts)
                ? signal.references?.[0]
                : signal;
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
                    onClick={() => handleSignalSelect(signal)}
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
                              ? `${calculateDistanceToSignal(extractCoordinates(signal)
                                  )?.toFixed(2)} km · ${bearing?.toFixed(
                                  0
                                )}° ${getCompassDirection(bearing!)}`
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
                          // relayCoordinates([signal.signal_text.objectLatitude,signal.signal_text.objectLongitude])
                          navigate("/maps");
                          ctx.mapNavigationHandler(latitude, longitude);
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
              bearing={calculateBearing(activeSignal.signal_body)!}
              open={_.isUndefined(activeSignal) ? false : true}
              setOpen={setActiveSignal}
              signal={activeSignal}
              distanceToSignal={distanceToSignal}
              compassDirection={getCompassDirection(
                calculateBearing(activeSignal.signal_body)
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
