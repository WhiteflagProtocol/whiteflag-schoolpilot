import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Signal } from "../../models/Signal";
import { Affix, Button, Card, Col, List, Row, Typography } from "antd";
import React from "react";
import { SetLocationModal } from "../LocationModal/SetLocationModal";
import config from "../../config.json";
import { PlusCircleOutlined } from "@ant-design/icons";
import { AddSignalDrawer } from "./AddSignalDrawer";

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
    }
  };

  const calculateAngelToDistance = (signal: Signal) => {
    // https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/
    if (location.latitude && location.longitude) {
      const x =
        Math.cos(signal.latitude) *
        Math.sin(location.longitude - signal.longitude);
      const y =
        Math.cos(location.latitude) * Math.sin(signal.latitude) -
        Math.sin(location.latitude) *
          Math.cos(signal.latitude) *
          Math.cos(location.longitude - signal.longitude);
      const radians = Math.atan2(x, y);
      const degrees = radians * (180 / Math.PI);
      return degrees;
    }
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
            <Typography.Text>{`${location?.latitude}, ${location?.longitude}`}</Typography.Text>
          </div>
          <div
            style={{ float: "right", marginRight: "8px", marginTop: "12px" }}
          >
            <Button onClick={() => setLocationModalVisable(true)}>
              Change
            </Button>
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
              fontSize: "20px",
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
        dataSource={signals}
        style={{ width: "100%" }}
        renderItem={(signal) => (
          <List.Item>
            <Card
              style={{
                marginTop: "16px",
                marginLeft: "10px",
                marginRight: "10px",
                borderColor: "#353941",
              }}
            >
              <Typography.Title
                level={1}
                style={{ fontWeight: "normal", marginTop: "0px" }}
              >
                {signal.name}
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{ marginTop: "0px", color: "#A3A3A3" }}
              >
                {signal.type}
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{ marginTop: "0px" }}
              >{`Distance: ${calculateDistanceToSignal(signal)?.toFixed(
                2
              )} km`}</Typography.Title>
              {/* <Typography.Title`
                level={5}
                style={{ marginTop: "0px" }}
              >{`Direction: ${calculateAngelToDistance(signal)?.toFixed(
                2
              )} degrees`}</Typography.Title>` */}
              <Typography.Text>{`${signal.latitude}, ${signal.longitude}`}</Typography.Text>
            </Card>
          </List.Item>
        )}
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
      />
    </React.Fragment>
  );
};
