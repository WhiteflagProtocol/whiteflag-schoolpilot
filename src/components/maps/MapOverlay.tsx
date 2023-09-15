import React, { useContext, useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  LayersControl,
} from "react-leaflet";
import CoordinatesHeader from "../layout/CoordinatesHeader";
import { Location } from "../signals/SignalsList";
import "../../styles/components/_leaflet.scss";
import WhiteFlagContext from "../../helpers/Context";
import PageToggle from "../layout/PageToggle";
import { DecodedSignal } from "../../models/DecodedSignal";
import { Affix, Button } from "antd";
import MarkerClusterGroup from "react-leaflet-cluster";

interface Props {
  onLocate: (location: Location) => void;
}
interface Coordinates {
  lat?: number;
  lng?: number;
}

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
const MapsOverlay = (props: any) => {
  const ctx = useContext(WhiteFlagContext);
  const [coordPosition, setCoordPosition]: any = useState([0, 0]);

  useEffect(() => {
    if (coordPosition[0] !== 0 && coordPosition[1] !== 0) {
      ctx.locationHandler(coordPosition);
    }
  }, [coordPosition]);

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (
        ctx.location[0 as keyof {}] !== 0 &&
        ctx.location[1 as keyof {}] !== 0
      ) {
        map.panTo([ctx.location[0 as keyof {}], ctx.location[1 as keyof {}]]);
      }
    }, [ctx.location]);

    return ctx.location[0 as keyof {}] === 0 &&
      ctx.location[1 as keyof {}] === 0 ? null : (
      <Marker
        position={[ctx.location[0 as keyof {}], ctx.location[1 as keyof {}]]}
        icon={GetUserIcon()}
      >
        <Popup>
          You are here
          <br />
          {coordPosition}
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
          ctx?.location?.latitude && ctx?.location?.longitude
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
          <LocationMarker />
          {ctx.whiteflagSignals.length > 0 &&
            ctx.whiteflagSignals.map((signal: DecodedSignal) => {
              if (
                signal?.signal_text?.objectLatitude &&
                signal?.signal_text?.objectLongitude
              ) {
                return (
                  <Marker
                    position={[
                      Number.parseFloat(signal.signal_text.objectLatitude),
                      Number.parseFloat(signal.signal_text.objectLongitude),
                    ]}
                    icon={GetWfIcon()}
                  >
                    <Popup>
                      School dummy title
                      <br />
                      {Number.parseFloat(signal.signal_text.objectLatitude)},
                      {Number.parseFloat(signal.signal_text.objectLongitude)}
                    </Popup>
                  </Marker>
                );
              }
            })}
          <PageToggle />
        </MarkerClusterGroup>
      </MapContainer>
    </React.Fragment>
  );
};

export default MapsOverlay;
