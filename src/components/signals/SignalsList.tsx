import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Signal } from "../../models/Signal";
import { Button, Card, List, Typography } from "antd";
import React from "react";
import { SetLocationModal } from "../LocationModal/SetLocationModal";

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

  const {
    entities: signals,
    endpoints: signalsEndpoint,
    loading: isLoadingSignals,
    error: signalsError,
  } = useApi<Signal>("http://localhost:5001/signals");

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

  const calculateDistanceToSingnal = (signal: Signal) => {
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

  return (
    <React.Fragment>
      <Typography.Title>{`Current location: ${location?.latitude}, ${location?.longitude}`}</Typography.Title>
      <Button onClick={() => setLocationModalVisable(true)}>
        Change coordinates
      </Button>
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
              title={signal.name}
              style={{ marginLeft: "10px", marginRight: "10px" }}
            >
              <p>{signal.type}</p>
              <p>{`${signal.latitude}, ${signal.longitude}`}</p>
              <p>{`Distance: ${calculateDistanceToSingnal(signal)?.toFixed(
                2
              )} km`}</p>
            </Card>
          </List.Item>
        )}
      ></List>
      <SetLocationModal
        location={location}
        setLocation={setLocation}
        open={locationModalVisable}
        setOpen={setLocationModalVisable}
      />
    </React.Fragment>
  );
};
