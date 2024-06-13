import React, { useState } from "react";
import { Address } from "../components/authentication/Authenticate";
import { Location } from "../components/signals/SignalsList";
import { DecodedSignal } from "../models/DecodedSignal";

export interface IWhiteflagContext {
  location: Location;
  whiteflagSignals: DecodedSignal[];
  locationHandler: (location: Location) => void;
  whiteFlagHandler: (whiteflagSignal: DecodedSignal[]) => void;
  filteredWhiteflagSignalsHandler: (
    filteredWhiteflagSignals: DecodedSignal[]
  ) => void;
  filteredWhiteflagTextSignals: DecodedSignal[];
  token: string;
  setToken: (token: string) => void;
  removeToken: () => void;
  address: string;
  setAddress: (address: Address) => void;
  removeAddress: () => void;
  mapNavigation: any;
  setMapNavigation: ([]) => void;
  mapNavigationHandler: (latitude: string, longitude: string) => void;
  activeSignal: any;
  activeSignalHandler: (activeSignal: DecodedSignal) => void;
}

const WhiteFlagContext = React.createContext<IWhiteflagContext>({
  location: {},
  locationHandler: (location: any) => {},
  whiteflagSignals: [],
  whiteFlagHandler: (whiteflag: DecodedSignal[]) => {},
  filteredWhiteflagSignalsHandler: (
    filteredWhiteflagSignals: DecodedSignal[]
  ) => {},
  filteredWhiteflagTextSignals: [],
  token: "",
  setToken: (token: string) => {},
  removeToken: () => {},
  address: "",
  setAddress: (address: Address) => {},
  removeAddress: () => {},
  mapNavigation: {},
  setMapNavigation: () => {},
  mapNavigationHandler: (latitude: string, longitude: string) => {},
  activeSignal: [],
  activeSignalHandler: (activeSignal: DecodedSignal) => {},
});

export const WhiteFlagContextProvider = (props: any) => {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString !== null) {
      const token = JSON.parse(tokenString);
      return token;
    } else {
      return "";
    }
  };

  const saveToken = (token: string) => {
    localStorage.setItem("token", JSON.stringify(token));
    setToken(token);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const getAddress = () => {
    const addressString = localStorage.getItem("address");
    if (addressString !== null) {
      const address: Address = JSON.parse(addressString);
      return address?.address;
    } else {
      return "";
    }
  };

  const saveAddress = (address: Address) => {
    localStorage.setItem("address", JSON.stringify(address));
    setAddress(address.address);
  };

  const removeAddress = () => {
    localStorage.removeItem("address");
    setAddress(null);
  };

  const locationHandler = (location: Location) => {
    if (location.latitude !== undefined) {
      setLocation(location);
      setMapNavigation(undefined);
    }
  };

  const whiteFlagHandler = (whiteflag: any) => {
    setWhiteflagSignals(whiteflag);
  };
  const mapNavigationHandler = (latitude: string, longitude: string) => {
    if (latitude !== undefined) {
      setMapNavigation([latitude, longitude]);
    } else {
      setMapNavigation(undefined);
    }
  };

  const activeSignalHandler = (activeSignal: DecodedSignal) => {
    if (activeSignal) {
      setActiveSignal(activeSignal);
    } else {
      setActiveSignal(undefined);
    }
  };
  const [activeSignal, setActiveSignal] = useState<DecodedSignal>();
  const filteredWhiteflagSignalsText = (
    filteredWhiteflagSignals: DecodedSignal[]
  ) => {
    setFilteredWhiteflagTextSignals(filteredWhiteflagSignals);
  };

  const [location, setLocation] = useState<any>({
    latitude: 0,
    longitude: 0,
  } as Location);
  const [whiteflagSignals, setWhiteflagSignals] = useState<DecodedSignal[]>([]);
  const [filteredWhiteflagTextSignals, setFilteredWhiteflagTextSignals] =
    useState<DecodedSignal[]>([]);
  const [token, setToken] = useState<string>(getToken());
  const [address, setAddress] = useState<string>(getAddress());
  const [mapNavigation, setMapNavigation] = useState<any>([0, 0]);
  return (
    <WhiteFlagContext.Provider
      value={{
        location: location,
        whiteflagSignals: whiteflagSignals,
        locationHandler: locationHandler,
        whiteFlagHandler: whiteFlagHandler,
        filteredWhiteflagSignalsHandler: setFilteredWhiteflagTextSignals,
        filteredWhiteflagTextSignals,
        token,
        setToken: saveToken,
        removeToken,
        address,
        setAddress: saveAddress,
        removeAddress,
        mapNavigation,
        setMapNavigation,
        mapNavigationHandler: mapNavigationHandler,
        activeSignal,
        activeSignalHandler: activeSignalHandler,
      }}
    >
      {props.children}
    </WhiteFlagContext.Provider>
  );
};

export default WhiteFlagContext;
