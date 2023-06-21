import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Signal } from "../../models/Signal";
import { Affix, Button, Card, Col, List, Row, Space, Typography } from "antd";
import React from "react";
import { SetLocationModal } from "../LocationModal/SetLocationModal";
import config from "../../config.json";
import { CompassOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { AddSignalDrawer } from "./AddSignalDrawer";
import dayjs from "dayjs";
import { SignalDetailDrawer } from "./SignalDetailDrawer";
import _ from "lodash";

export interface Location {
  latitude?: number;
  longitude?: number;
}

export const SignalsList: React.FC = () => {
  const [locationModalVisable, setLocationModalVisable] =
    useState<boolean>(false);

  const [location, setLocation] = useState<Location>({
    latitude: undefined,
    longitude: undefined,
  });

  const [newSignalDrawerOpen, setNewSignalDrawerOpen] =
    useState<boolean>(false);

  const [activeSignal, setActiveSignal] = useState<Signal>();

  const {
    entities: signals,
    endpoints: signalsEndpoint,
    loading: isLoadingSignals,
    error: signalsError,
  } = useApi<Signal>(`${config.baseUrl}/signals`);

  useEffect(() => {
    signalsEndpoint.getAll();
    getLocation();
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    });
  };

  const degreesToRadians = (deg: number) => {
    return (deg * Math.PI) / 180;
  };

  const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
  };

  const calculateDistanceToSignal = (signal: Signal) => {
    if (location.latitude && location.longitude) {
      const r = 6371; // Radius of the earth in km. Use 3956 for miles
      const lat1 = degreesToRadians(location.latitude);
      const lat2 = degreesToRadians(signal.latitude);
      const lon1 = degreesToRadians(location.longitude);
      const lon2 = degreesToRadians(signal.longitude);

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
      return 0.01;
    }
  };

  const calculateBearing = (signal: Signal) => {
    if (location.latitude && location.longitude) {
      const originRadLat = degreesToRadians(location.latitude);
      const originRadLng = degreesToRadians(location.longitude);
      const targetRadLat = degreesToRadians(signal.latitude);
      const targetRadLng = degreesToRadians(signal.longitude);

      const lngDiff = targetRadLng - originRadLng;

      const y = Math.sin(lngDiff) * Math.cos(targetRadLat);
      const x =
        Math.cos(originRadLat) * Math.sin(targetRadLat) -
        Math.sin(originRadLat) * Math.cos(targetRadLat) * Math.cos(lngDiff);

      const bearingRad = Math.atan2(y, x);
      const bearingDeg = radiansToDegrees(bearingRad);

      return (bearingDeg + 360) % 360;
    } else {
      return 0.01;
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

  const compareDistances = (signalA: Signal, signalB: Signal) => {
    const distanceToSignalA = calculateDistanceToSignal(signalA);
    const distanceToSignalB = calculateDistanceToSignal(signalB);
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
      <Affix offsetTop={0} style={{ marginTop: "-20px" }}>
        <div
          style={{
            backgroundColor: "#353941",
            height: "56px",
            overflow: "initial",
            top: "24px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <div style={{ display: "inline-block", marginLeft: "8px" }}>
            <Typography.Title
              level={5}
              style={{
                color: "white",
                marginTop: "4px",
                marginBottom: "0px",
              }}
            >
              GPS coordinates
            </Typography.Title>
            <Typography.Text>
              {`${location?.latitude}, ${location?.longitude}`}
            </Typography.Text>
          </div>
          <div
            style={{ float: "right", marginRight: "16px", marginTop: "15px" }}
          >
            <Typography.Link
              strong
              onClick={() => setLocationModalVisable(true)}
            >
              Change
            </Typography.Link>
          </div>
        </div>
      </Affix>
      <Row style={{ marginTop: "24px", marginBottom: "0px" }}>
        <Col span={21}>
          <Typography.Title
            level={1}
            style={{
              fontWeight: "normal",
              marginTop: "0px",
              marginBottom: "0px",
              textAlign: "left",
              paddingLeft: "10px",
            }}
          >
            Nearby
          </Typography.Title>
        </Col>
        <Col span={3} style={{ paddingRight: "10px", display: "grid" }}>
          <PlusCircleOutlined
            onClick={() => {
              setNewSignalDrawerOpen(true);
            }}
            style={{
              color: "#A1D2FF",
              fontSize: "24px",
              marginRight: "0px",
              marginLeft: "auto",
            }}
          />
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
        loading={isLoadingSignals}
        dataSource={signals.sort(compareDistances)}
        style={{ width: "100%" }}
        renderItem={(signal) => {
          const bearing = calculateBearing(signal);
          return (
            <List.Item>
              <Card
                hoverable
                style={{
                  marginTop: "16px",
                  marginLeft: "10px",
                  marginRight: "10px",
                  borderColor: "#353941",
                }}
                onClick={() => setActiveSignal(signal)}
              >
                <Row>
                  <Typography.Text type={"secondary"}>
                    {signal.type}
                  </Typography.Text>
                </Row>
                <Row>
                  <Typography.Title
                    level={1}
                    style={{ fontWeight: "normal", marginTop: "0px" }}
                  >
                    {signal.name}
                  </Typography.Title>
                </Row>
                <Row>
                  <CompassOutlined style={{ paddingRight: "10px" }} />
                  <Typography.Text style={{ marginTop: "0px" }}>
                    {`${calculateDistanceToSignal(signal)?.toFixed(
                      2
                    )} km · ${bearing?.toFixed(0)}° ${getCompassDirection(
                      bearing!
                    )}`}
                  </Typography.Text>
                </Row>
                <Row>
                  <Typography.Text
                    type={"secondary"}
                  >{`${signal.latitude.toFixed(8)}, ${signal.longitude.toFixed(
                    8
                  )}`}</Typography.Text>
                </Row>
                <div style={{ paddingTop: "16px" }}>
                  <Row>
                    <Typography.Text type={"secondary"}>
                      Last updated
                    </Typography.Text>
                  </Row>
                  <Row>
                    <Typography.Text>
                      {dayjs(signal.lastUpdate).format("D MMMM YYYY, HH:mm")}
                    </Typography.Text>
                  </Row>
                  <Row>
                    <Typography.Text>{`by ${signal.lastUpdateBy}`}</Typography.Text>
                  </Row>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
      <SetLocationModal
        location={location}
        setLocation={setLocation}
        setCurrentLocation={() => getLocation()}
        open={locationModalVisable}
        setOpen={setLocationModalVisable}
      />
      <AddSignalDrawer
        open={newSignalDrawerOpen}
        setOpen={setNewSignalDrawerOpen}
        signalsEndpoint={signalsEndpoint}
      />
      {activeSignal && (
        <SignalDetailDrawer
          bearing={calculateBearing(activeSignal)!}
          open={_.isUndefined(activeSignal) ? false : true}
          setOpen={setActiveSignal}
          signal={activeSignal}
          distanceToSignal={calculateDistanceToSignal(activeSignal)}
          compassDirection={getCompassDirection(calculateBearing(activeSignal))}
        />
      )}
    </React.Fragment>
  );
};
