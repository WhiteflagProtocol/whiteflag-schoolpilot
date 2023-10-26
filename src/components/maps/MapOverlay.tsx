import { Affix, Space, Typography } from "antd";
import L from "leaflet";
import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useNavigate } from "react-router-dom";
import WhiteFlagContext from "../../helpers/Context";
import { DecodedSignal } from "../../models/DecodedSignal";
import { SignalBodyText } from "../../models/SignalBodyText";
import "../../styles/components/_leaflet.scss";
import CoordinatesHeader from "../layout/CoordinatesHeader";
import PageToggle from "../layout/PageToggle";
import { AddSignalDrawer } from "../signals/AddSignalDrawer";

const { Text } = Typography;

function GetWfIcon() {
  return new L.Icon({
    iconUrl: "/assets/white-flag-marker.png",
    iconSize: [40, 45],
  });
}
function GetUserIcon() {
  return new L.Icon({
    iconUrl: "/assets/user-location-marker.png",
    iconSize: [30, 30],
  });
}
const MapsOverlay = () => {
  const navigate = useNavigate();
  const [newSignalDrawerOpen, setNewSignalDrawerOpen] =
    useState<boolean>(false);
  const ctx = useContext(WhiteFlagContext);

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (
        ctx.location?.latitude &&
        ctx.location?.longitude &&
        !ctx.mapNavigation
      ) {
        map.panTo([ctx.location?.latitude, ctx.location?.longitude]);
      }
    }, [ctx.location]);

    useEffect(() => {
      if (ctx.mapNavigation) {
        map.panTo(ctx.mapNavigation);
      }
    }, [ctx.mapNavigation]);

    return ctx.location?.latitude === 0 &&
      ctx.location?.longitude === 0 &&
      !_.isNil(ctx.location?.latitude) &&
      !_.isNil(ctx.location?.longitude) ? null : (
      <Marker
        position={[ctx.location?.latitude, ctx.location?.longitude]}
        icon={GetUserIcon()}
      >
        <Popup>
          <Space className="marker-content">
            <Text
              style={{
                fontSize: "16px",
                lineHeight: "25px",
                fontWeight: "600",
              }}
            >
              You are here
            </Text>
            <Text style={{ fontSize: "14px", lineHeight: "18px" }}>
              {`${ctx?.location?.latitude}, ${ctx?.location?.longitude}`}
            </Text>
          </Space>
        </Popup>
      </Marker>
    );
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

      <MapContainer
        center={
          ctx.mapNavigation
            ? ctx.mapNavigation
            : ctx?.location?.latitude && ctx?.location?.longitude
            ? [ctx?.location?.latitude, ctx?.location?.longitude]
            : [7.8626845, 29.6949232]
        }
        zoom={8}
        maxZoom={18}
        scrollWheelZoom={false}
      >
        <MarkerClusterGroup
          chunkedLoading
          spiderfyOnMaxZoom
          showCoverageOnHover
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {ctx.filteredWhiteflagTextSignals.length > 0 &&
            ctx.filteredWhiteflagTextSignals.map((signal: DecodedSignal) => {
              const texts = signal?.signal_body?.text
                ? (JSON.parse(signal.signal_body.text) as SignalBodyText)
                : undefined;

              const infrastructureSignal = !_.isUndefined(texts)
                ? signal.references?.[0]
                : signal;

              if (
                infrastructureSignal?.signal_body?.objectLatitude &&
                infrastructureSignal?.signal_body?.objectLongitude
              ) {
                return (
                  <Marker
                    key={signal.id}
                    position={[
                      Number.parseFloat(
                        infrastructureSignal.signal_body.objectLatitude
                      ),
                      Number.parseFloat(
                        infrastructureSignal.signal_body.objectLongitude
                      ),
                    ]}
                    icon={GetWfIcon()}
                  >
                    <Popup>
                      <a
                        className="marker-content"
                        onClick={() => {
                          ctx.mapNavigationHandler(
                            infrastructureSignal.signal_body.objectLatitude,
                            infrastructureSignal.signal_body.objectLongitude
                          );
                          ctx.activeSignalHandler(signal);
                          navigate("/");
                        }}
                      >
                        <Space direction="vertical" align="start">
                          <Text
                            style={{
                              fontSize: "16px",
                              lineHeight: "25px",
                              fontWeight: "600",
                            }}
                          >
                            {texts?.name ?? "No name given"}
                          </Text>
                          <Text
                            style={{ fontSize: "14px", lineHeight: "18px" }}
                          >
                            {Number.parseFloat(
                              infrastructureSignal.signal_body.objectLatitude
                            )}
                            ,
                            {Number.parseFloat(
                              infrastructureSignal.signal_body.objectLongitude
                            )}
                          </Text>
                        </Space>
                      </a>
                    </Popup>
                  </Marker>
                );
              }
            })}
          {!newSignalDrawerOpen && (
            <PageToggle setNewSignalDrawerOpen={setNewSignalDrawerOpen} />
          )}
        </MarkerClusterGroup>
        <LocationMarker />
      </MapContainer>
      <AddSignalDrawer
        open={newSignalDrawerOpen}
        setOpen={setNewSignalDrawerOpen}
      />
    </React.Fragment>
  );
};

export default MapsOverlay;
