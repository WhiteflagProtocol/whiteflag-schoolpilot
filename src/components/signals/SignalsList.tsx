import {
  CompassOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Affix, Card, Col, List, Row, Typography } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
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
    loading: isLoadingDecodeList,
    error: decodeListError,
  } = useApi<WhiteflagResponse[]>({
    url: `${config.baseUrl}${Settings.endpoints.whiteflag.decodeList}`,
  });

  useEffect(() => {
    signalsEndpoint.getAll();
  }, []);

  useEffect(() => {
    if (signalResponses) {
      getAllSignals();
    }
  }, [signalResponses]);

  // useEffect(() => {
  //   ctx.whiteFlagHandler(whiteflagSignals);
  // }, [whiteflagSignals]);

  // useEffect(() => {
  //   ctx.locationHandler(location);
  // }, [location]);

  const getAllSignals = async () => {
    const ids = signalResponses
      .map((response) => response.id)
      // .filter((id) => id !== 3);
      .filter((id) => id > 115 && id < 130); // TODO: Remove when loading is faster

    const whiteflagResponse = await decodeListEndpoint.directPost({
      signals: ids,
    });

    if (whiteflagResponse) {
      ctx.whiteFlagHandler(
        whiteflagResponse.map(
          (response) => response as unknown as DecodedSignal
        )
      );
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
    const distanceToSignalA = calculateDistanceToSignal(signalA.signal_body);
    const distanceToSignalB = calculateDistanceToSignal(signalB.signal_body);
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

  return (
    <React.Fragment>
      <Affix offsetTop={0} style={{ marginTop: "-20px" }}>
        <div
          style={{
            backgroundColor: "#25292D",
            height: "56px",
            overflow: "initial",
            top: "24px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <CoordinatesHeader />
        </div>
      </Affix>
      <Row style={{ marginTop: "24px", marginBottom: "16px" }}>
        <Col span={19}>
          <Typography.Title
            level={1}
            style={{
              fontWeight: "normal",
              marginTop: "0px",
              textAlign: "left",
              paddingLeft: "10px",
            }}
          >
            Nearby signs
          </Typography.Title>
        </Col>
        <Col span={5} style={{ paddingRight: "16px", display: "flex" }}>
          <ReloadOutlined
            onClick={() => {
              signalsEndpoint.getAll();
            }}
            style={{
              color: "#A1D2FF",
              fontSize: "24px",
            }}
          />
          <PlusCircleOutlined
            onClick={() => {
              setNewSignalDrawerOpen(true);
            }}
            style={{
              display: "flex",
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
        loading={isLoadingSignals || isLoadingDecodeList}
        dataSource={ctx?.filteredWhiteflagTextSignals}
        style={{ width: "100%" }}
        renderItem={(signal) => {
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
                bodyStyle={{ padding: "16px" }}
                style={{
                  marginLeft: "10px",
                  marginRight: "10px",
                  borderColor: "#353941",
                }}
                onClick={() => setActiveSignal(signal)}
              >
                <Row>
                  <Typography.Text type={"secondary"}>
                    {Object.keys(InfrastructureSubjectCode)[subjectCodeIndex]}
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
                <Row>
                  <CompassOutlined
                    style={{
                      paddingRight: "10px",
                    }}
                  />
                  <div>
                    <Row>
                      <Typography.Text style={{ marginTop: "0px" }}>
                        {bearing
                          ? `${calculateDistanceToSignal(
                              infrastructureSignal.signal_body
                            )?.toFixed(2)} km · ${bearing?.toFixed(
                              0
                            )}° ${getCompassDirection(bearing!)}`
                          : "Provide reference location"}
                      </Typography.Text>
                    </Row>
                    <Row>
                      <Typography.Text type={"secondary"}>{`${
                        infrastructureSignal.signal_body.objectLatitude
                          ? Number.parseFloat(
                              infrastructureSignal.signal_body.objectLatitude
                            )?.toFixed(8)
                          : 0
                      }, ${
                        infrastructureSignal.signal_body.objectLongitude
                          ? Number.parseFloat(
                              infrastructureSignal.signal_body.objectLongitude
                            )?.toFixed(8)
                          : 0
                      }`}</Typography.Text>
                    </Row>
                  </div>
                </Row>
                <div style={{ paddingTop: "16px" }}>
                  <Row>
                    <Typography.Text type={"secondary"}>
                      Last updated
                    </Typography.Text>
                  </Row>
                  <Row>
                    <Typography.Text>
                      {dayjs(infrastructureSignal.timestamp).format(
                        "D MMMM YYYY, HH:mm"
                      )}
                    </Typography.Text>
                  </Row>
                  <Row>
                    <Typography.Text>{`by ${infrastructureSignal.sender.username}`}</Typography.Text>
                  </Row>
                </div>
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
      <AddSignalDrawer
        open={newSignalDrawerOpen}
        setOpen={setNewSignalDrawerOpen}
        signalsEndpoint={signalsEndpoint}
      />
      {activeSignal && (
        <SignalDetailDrawer
          bearing={calculateBearing(activeSignal.signal_body)!}
          open={_.isUndefined(activeSignal) ? false : true}
          setOpen={setActiveSignal}
          signal={activeSignal}
          distanceToSignal={calculateDistanceToSignal(activeSignal.signal_body)}
          compassDirection={getCompassDirection(
            calculateBearing(activeSignal.signal_body)
          )}
        />
      )}
      <PageToggle />
    </React.Fragment>
  );
};
