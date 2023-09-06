import React, { useState } from "react";
import {
  Address,
  LoginResponse,
} from "../components/authentication/Authenticate";
import { Location } from "../components/signals/SignalsList";
import { DecodedSignal } from "../models/DecodedSignal";

export interface IWhiteflagContext {
  location: Location;
  whiteflagSignals: DecodedSignal[];
  locationHandler: (location: Location) => void;
  whiteFlagHandler: (whiteflagSignal: DecodedSignal[]) => void;
  token: string;
  setToken: (token: string) => void;
  removeToken: () => void;
  address: string;
  setAddress: (address: Address) => void;
  removeAddress: () => void;
}

const WhiteFlagContext = React.createContext<IWhiteflagContext>({
  location: {},
  locationHandler: (location: any) => {},
  whiteflagSignals: [],
  whiteFlagHandler: (whiteflag: DecodedSignal[]) => {},
  token: "",
  setToken: (token: string) => {},
  removeToken: () => {},
  address: "",
  setAddress: (address: Address) => {},
  removeAddress: () => {},
});

export const WhiteFlagContextProvider = (props: any) => {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString !== null) {
      const userToken: LoginResponse = JSON.parse(tokenString);
      return userToken?.token;
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

  const locationHandler = (location: any) => {
    if (location.latitude !== undefined) {
      setLocation([location.latitude, location.longitude]);
    }
  };

  const whiteFlagHandler = (whiteflag: any) => {
    setWhiteflagSignals(whiteflag);
  };

  const [location, setLocation] = useState<any>([0, 0]);
  const [whiteflagSignals, setWhiteflagSignals] = useState<DecodedSignal[]>([]);
  const [token, setToken] = useState<string>(getToken());
  const [address, setAddress] = useState<string>(getAddress());

  return (
    <WhiteFlagContext.Provider
      value={{
        location: location,
        whiteflagSignals: whiteflagSignals,
        locationHandler: locationHandler,
        whiteFlagHandler: whiteFlagHandler,
        token,
        setToken: saveToken,
        removeToken,
        address,
        setAddress: saveAddress,
        removeAddress,
      }}
    >
      {props.children}
    </WhiteFlagContext.Provider>
  );
};

export default WhiteFlagContext;
