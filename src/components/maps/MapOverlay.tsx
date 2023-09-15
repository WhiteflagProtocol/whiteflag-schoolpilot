import { Affix } from "antd";
import L from "leaflet";
import React, { useContext, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import WhiteFlagContext from "../../helpers/Context";
import { DecodedSignal } from "../../models/DecodedSignal";
import "../../styles/components/_leaflet.scss";
import CoordinatesHeader from "../layout/CoordinatesHeader";
import PageToggle from "../layout/PageToggle";
import { Location } from "../signals/SignalsList";
import _ from "lodash";

interface Props {}
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
const MapsOverlay = (props: Props) => {
  const ctx = useContext(WhiteFlagContext);
  // const [coordPosition, setCoordPosition]: any = useState([0, 0]);

  // useEffect(() => {
  //   if (coordPosition[0] !== 0 && coordPosition[1] !== 0) {
  //     ctx.locationHandler(coordPosition);
  //   }
  // }, [coordPosition]);

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (ctx.location?.latitude && ctx.location?.longitude) {
        map.panTo([ctx.location?.latitude, ctx.location?.longitude]);
      }
    }, [ctx.location]);

    return ctx.location?.latitude === 0 &&
      ctx.location?.longitude === 0 &&
      !_.isNil(ctx.location?.latitude) &&
      !_.isNil(ctx.location?.longitude) ? null : (
      <Marker
        position={[ctx.location?.latitude, ctx.location?.longitude]}
        icon={GetUserIcon()}
      >
        <Popup>
          You are here
          <br />
          {`${ctx?.location?.latitude}, ${ctx?.location?.longitude}`}
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
