import React, { useContext, useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Popup, Marker, useMap } from "react-leaflet";
import CoordinatesHeader from "../layout/CoordinatesHeader";
import { Location } from "../signals/SignalsList";
import "../../styles/components/_leaflet.scss";
import WhiteFlagContext from "../../helpers/Context";
import PageToggle from "../layout/PageToggle";


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
      <CoordinatesHeader />
      <MapContainer
        center={[7.8626845, 29.6949232]}
        zoom={8}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ctx.whiteflagSignals.length > 0 &&
          ctx.whiteflagSignals.map((signal: any) => {
            if (signal.objectLatitude  && signal.objectLongitude ) {
              return (
                <Marker
                  position={[signal.objectLatitude, signal.objectLongitude]}
                  icon={GetWfIcon()}
                >
                  <Popup>
                    School dummy title 
                    <br />
                    {[signal.objectLatitude, signal.objectLongitude]}
                  </Popup>
                </Marker>
              );
            }
          })}

        <LocationMarker />
      </MapContainer>
      <PageToggle />
    </React.Fragment>
  );
};

export default MapsOverlay;
