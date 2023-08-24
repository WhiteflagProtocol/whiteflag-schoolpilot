import React, { useState, createContext } from "react";
import { WhiteflagResponse, WhiteflagSignal } from "../models/WhiteflagSignal";
import { Location } from "../components/signals/SignalsList";
import { LatLngExpression } from "leaflet";

const WhiteFlagContext = React.createContext({
  location: {},
  locationHandler: (location:any) => {},
  whiteflagSignals: [{}],
  whiteFlagHandler:(whiteflag:WhiteflagSignal[]) => {}
});

export const WhiteFlagContextProvider = (props: any) => {
  const [location, setLocation] = useState<any>([0,0]);
  const [whiteflagSignals, setWhiteflagSignals] = useState<WhiteflagSignal[]>([]);

  const locationHandler = (location:any) => {
    if(location.latitude !== undefined) {
      setLocation([location.latitude, location.longitude]);
    }
  };

  const whiteFlagHandler = (whiteflag:any) => {
    setWhiteflagSignals(whiteflag)
  }

  return (
    <WhiteFlagContext.Provider
      value={{
        location: location,
        whiteflagSignals: whiteflagSignals,
        locationHandler: locationHandler,
        whiteFlagHandler:whiteFlagHandler
      }}
    >
      {props.children}
    </WhiteFlagContext.Provider>
  );
};

export default WhiteFlagContext;
