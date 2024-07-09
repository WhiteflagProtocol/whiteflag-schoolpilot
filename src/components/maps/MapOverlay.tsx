import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Affix, Space, Typography } from "antd";
import L from "leaflet";
import _ from "lodash";

import WhiteFlagContext from "../../helpers/Context";
import { DecodedSignal } from "../../models/DecodedSignal";
import { SignalBodyText } from "../../models/SignalBodyText";
import "../../styles/components/_leaflet.scss";
import CoordinatesHeader from "../layout/CoordinatesHeader";
import PageToggle from "../layout/PageToggle";
import { SignalDetailDrawer } from "../signals/SignalDetailDrawer";

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
  const ctx = useContext(WhiteFlagContext);
  const [newSignalDrawerOpen, setNewSignalDrawerOpen] = useState<boolean>(false);
  const [selectedSignal, setSelectedSignal] = useState<DecodedSignal | null>(null);

  const handleMarkerClick = (signal: DecodedSignal) => {
    const coordinates = ctx.extractCoordinates(signal);
    if (coordinates) {
      const distance = ctx.calculateDistanceToSignal({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      });
      setSelectedSignal(signal);
      ctx.setDistanceToSignal(distance);
    } else {
      console.error("No valid coordinates found for this signal.");
    }
  };

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;
      if (ctx.mapNavigation && Array.isArray(ctx.mapNavigation) && ctx.mapNavigation.length === 2) {
        const [lat, lng] = ctx.mapNavigation.map(Number);
        if (!isNaN(lat) && !isNaN(lng) && isValidCoordinates(lat, lng)) {
          map.setView([lat, lng], 14);
        }
      } else {
        const [center, zoom] = calculateCenterAndZoom(ctx.validSignals);
        if (isValidCoordinates(center[0], center[1])) {
          map.setView(center, zoom);
        }
      }
    }, [ctx.mapNavigation, ctx.validSignals, map]);

    const validSignals = useMemo(() => {
      const signalsWithValidCoordinates = ctx?.filteredWhiteflagTextSignals.filter(signal => {
        const coordinates = ctx.extractCoordinates(signal);
        return coordinates !== null;
      });

      return signalsWithValidCoordinates;
  
    }, [ctx.filteredWhiteflagTextSignals, ctx.extractCoordinates]);

    useEffect(() => {
      ctx.setValidSignals(validSignals);
    }, [validSignals, ctx.setValidSignals]);

    useEffect(() => {
      ctx.setLastPage(window.location.pathname);
    }, [ctx]);

    const calculateCenterAndZoom = (signals: DecodedSignal[]): [[number, number], number] => {
      const defaultCenter: [number, number] = [52.062844670620784, 4.9884179912289905];
      const defaultZoom = 8;
    
      if (signals.length === 0) {
        return [defaultCenter, defaultZoom];
      }
    
      const latitudes = signals.map(sig => Number.parseFloat(sig.references[0].signal_body.objectLatitude));
      const longitudes = signals.map(sig => Number.parseFloat(sig.references[0].signal_body.objectLongitude));
    
      const maxLat = Math.max(...latitudes);
      const minLat = Math.min(...latitudes);
      const maxLng = Math.max(...longitudes);
      const minLng = Math.min(...longitudes);
    
      const centerLat = (maxLat + minLat) / 2;
      const centerLng = (maxLng + minLng) / 2;
    
      const zoomLevel = getZoomLevel(maxLat, minLat, maxLng, minLng);
      return [[centerLat, centerLng], zoomLevel];
    };

    const getZoomLevel = (maxLat: number, minLat: number, maxLng: number, minLng: number) => {
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      if (latDiff > 20 || lngDiff > 20) return 3;
      if (latDiff > 10 || lngDiff > 10) return 5;
      if (latDiff > 5 || lngDiff > 5) return 7;
      if (latDiff > 2 || lngDiff > 2) return 9;
      return 8;
    };

    const isValidCoordinates = (lat: number, lng: number) => {
      return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    };
    
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
        center={[0, 0]}
        zoom={8}
        maxZoom={18}
        scrollWheelZoom={true}
      >
      <LocationMarker />
      <MarkerClusterGroup
        chunkedLoading
        spiderfyOnMaxZoom
        showCoverageOnHover
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {ctx.validSignals.length > 0 &&
        ctx.validSignals.map((signal: DecodedSignal) => {
          const texts = signal?.signal_body?.text
            ? (JSON.parse(signal.signal_body.text) as SignalBodyText)
            : undefined;

            const lat = Number.parseFloat(signal?.references[0].signal_body?.objectLatitude);
            const lng = Number.parseFloat(signal?.references[0].signal_body?.objectLongitude);

          if (lat && lng) {
            return (
              <Marker
                key={signal.id}
                position={[lat, lng]}
                icon={GetWfIcon()}
              >
                <Popup>
                  <a
                    className="marker-content"
                    onClick={() => handleMarkerClick(signal)}
                  >
                    <Space direction="vertical" align="start">
                      <Text
                        style={{
                          fontSize: "16px",
                          lineHeight: "25px",
                          fontWeight: "600"
                        }}
                      >
                        {texts?.name ?? "No name given"}
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="-150 -960 960 450" width="24px" fill="#000">
                          <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
                        </svg>

                      </Text>
                      <Text
                        style={{ fontSize: "14px", lineHeight: "18px" }}
                      >
                        {lat}
                        ,
                        {lng}
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
      {ctx.mapNavigation && Array.isArray(ctx.mapNavigation) && ctx.mapNavigation.length === 2 && (
        <Marker
          position={[ctx.mapNavigation[0], ctx.mapNavigation[1]]}
          icon={GetWfIcon()}
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
                Target Location
              </Text>
              <Text style={{ fontSize: "14px", lineHeight: "18px" }}>
                {`${ctx.mapNavigation[0]}, ${ctx.mapNavigation[1]}`}
              </Text>
            </Space>
          </Popup>
        </Marker>
      )}
      {selectedSignal && (
        <SignalDetailDrawer
          bearing={ctx.calculateBearing(selectedSignal)}
          open={_.isUndefined(selectedSignal) ? false : true}
          setOpen={setSelectedSignal}
          signal={selectedSignal}
          distanceToSignal={ctx.distanceToSignal}
          compassDirection={ctx.getCompassDirection(ctx.calculateBearing(selectedSignal))}
        />
      )}
      </MapContainer>
    </React.Fragment>
  );
};

export default MapsOverlay;
