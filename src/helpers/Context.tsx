import React, { useState } from "react";
import { Address } from "../components/authentication/Authenticate";
import { Location } from "../components/signals/SignalsList";
import { DecodedSignal } from "../models/DecodedSignal";

export interface IWhiteflagContext {
  location: Location;
  locationHandler: (location: Location) => void;
  whiteflagSignals: DecodedSignal[];
  lastPage: string;
  setLastPage: (page: string) => void;
  extractCoordinates: (signal: DecodedSignal) => { latitude: string, longitude: string } | null;
  calculateDistanceToSignal: (coordinates: { latitude: string, longitude: string }) => number;
  calculateBearing: (signal: DecodedSignal) => number;
  getCompassDirection: (degree: number) => "N" | "E" | "S" | "W";
  compareDistances: (signalA: DecodedSignal, signalB: DecodedSignal) => number;
  handleSignalSelect: (signal: DecodedSignal) => void;
  validSignals: DecodedSignal[];
  setValidSignals: (signals: DecodedSignal[]) => void;
  distanceToSignal: number;
  setDistanceToSignal: (distanceToSignal: number) => void;
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
  mapNavigation: number[] | undefined;
  setMapNavigation: (navigation: number[] | undefined) => void;
  mapNavigationHandler: (latitude: string, longitude: string) => void;
  activeSignal: DecodedSignal | undefined;
  activeSignalHandler: (activeSignal: DecodedSignal | undefined) => void;
  resetNavigation: () => void;
}

const WhiteFlagContext = React.createContext<IWhiteflagContext>({
  location: {},
  locationHandler: (location: any) => {},
  whiteflagSignals: [],
  lastPage: "",
  setLastPage: (page: string) => {},
  extractCoordinates: (signal: DecodedSignal) => null,
  calculateDistanceToSignal: (coordinates: { latitude: string, longitude: string }) => 0,
  calculateBearing: (signal: DecodedSignal) => 0,
  getCompassDirection: (degree: number) => "N",
  compareDistances: (signalA: DecodedSignal, signalB: DecodedSignal) => 0,
  handleSignalSelect: (signal: DecodedSignal) => {},
  validSignals: [],
  setValidSignals: () => {},
  distanceToSignal: 0,
  setDistanceToSignal: () => {},
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
  mapNavigation: [],
  setMapNavigation: () => {},
  mapNavigationHandler: (latitude: string, longitude: string) => {},
  activeSignal: undefined,
  activeSignalHandler: (activeSignal: DecodedSignal) => {},
  resetNavigation: () => {}
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
    if (latitude !== undefined && longitude !== undefined) {
      setMapNavigation([parseFloat(latitude), parseFloat(longitude)]);
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

  const degreesToRadians = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
  };

  const extractCoordinates = (signal: DecodedSignal): { latitude: string; longitude: string } | null => {
    // First, check the main signal body
    if (signal.signal_body.objectLatitude && signal.signal_body.objectLongitude) {
        return {
            latitude: signal.signal_body.objectLatitude,
            longitude: signal.signal_body.objectLongitude
        };
    }

    // If not found directly, check the references
    const foundReference = signal.references?.find(ref => 
        ref.signal_body.objectLatitude && ref.signal_body.objectLongitude
    );
    if (foundReference) {
        return {
            latitude: foundReference.signal_body.objectLatitude,
            longitude: foundReference.signal_body.objectLongitude
        };
    }
    return null;
};

  const calculateDistanceToSignal = (coordinates: { latitude: string, longitude: string }) => {
    const { latitude, longitude } = location;
    if (latitude && longitude) {
      const r = 6371; // Radius of the earth in km. Use 3956 for miles
      const lat1 = degreesToRadians(latitude);
      const lon1 = degreesToRadians(longitude);
      
      const lat2 = degreesToRadians(coordinates?.latitude ? Number.parseFloat(coordinates.latitude) : 0);
      const lon2 = degreesToRadians(coordinates?.longitude ? Number.parseFloat(coordinates.longitude) : 0);
  
      // Haversine formula
      const dlat = lat2 - lat1;
      const dlon = lon2 - lon1;
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

  const calculateBearing = (signal: DecodedSignal) => {
    if (!location?.latitude || !location?.longitude) {
      return 0.0;
    }

    const coordinates = extractCoordinates(signal);
    if (!coordinates) {
      console.warn("No valid coordinates found for bearing calculation.");
      return 0.0;
    }
  
    const originRadLat = degreesToRadians(location.latitude);
    const originRadLng = degreesToRadians(location.longitude);
  
    const targetRadLat = degreesToRadians(parseFloat(coordinates.latitude));
    const targetRadLng = degreesToRadians(parseFloat(coordinates.longitude));
  
    const lngDiff = targetRadLng - originRadLng;
  
    const y = Math.sin(lngDiff) * Math.cos(targetRadLat);
    const x = Math.cos(originRadLat) * Math.sin(targetRadLat) - Math.sin(originRadLat) * Math.cos(targetRadLat) * Math.cos(lngDiff);
  
    const bearingRad = Math.atan2(y, x); // atan2 expects angles in radians
    const bearingDeg = radiansToDegrees(bearingRad); // Convert result from radians to degrees
  
    return (bearingDeg + 360) % 360; // Normalize to 0-360
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
    const coordinatesA = extractCoordinates(signalA);
    const coordinatesB = extractCoordinates(signalB);
    if (!coordinatesA || !coordinatesB) return 0;
  
    const distanceToCoordA = calculateDistanceToSignal({
      latitude: coordinatesA.latitude,
      longitude: coordinatesA.longitude,
    });
    const distanceToCoordB = calculateDistanceToSignal({
      latitude: coordinatesB.latitude,
      longitude: coordinatesB.longitude,
    });
    return distanceToCoordA - distanceToCoordB;
  };

  const handleSignalSelect = (signal: DecodedSignal) => {
    const coordinates = extractCoordinates(signal);
    if (!coordinates) {
      console.warn("No valid coordinates available.");
      return;
    }
  
    const distance = calculateDistanceToSignal(coordinates);
    setDistanceToSignal(distance);
    setActiveSignal(signal);
  };

  const resetNavigation = () => {
    setMapNavigation(undefined);
  };

  const [location, setLocation] = useState<any>({
    latitude: 0,
    longitude: 0,
  } as Location);
  const [whiteflagSignals, setWhiteflagSignals] = useState<DecodedSignal[]>([]);
  const [mapNavigation, setMapNavigation] = useState<number[] | undefined>();
  const [activeSignal, setActiveSignal] = useState<DecodedSignal | undefined>();
  const [token, setToken] = useState<string>(getToken());
  const [address, setAddress] = useState<string>(getAddress());
  const [validSignals, setValidSignals] = useState<DecodedSignal[]>([]);
  const [distanceToSignal, setDistanceToSignal] = useState<number>(0);
  const [lastPage, setLastPage] = useState("");
  const filteredWhiteflagSignalsText = (
    filteredWhiteflagSignals: DecodedSignal[]
  ) => {
    setFilteredWhiteflagTextSignals(filteredWhiteflagSignals);
  };
  const [filteredWhiteflagTextSignals, setFilteredWhiteflagTextSignals] =
    useState<DecodedSignal[]>([]);
  return (
    <WhiteFlagContext.Provider
      value={{
        location: location,
        whiteflagSignals: whiteflagSignals,
        lastPage: lastPage,
        setLastPage: setLastPage,
        extractCoordinates: extractCoordinates,
        calculateDistanceToSignal: calculateDistanceToSignal,
        calculateBearing: calculateBearing,
        getCompassDirection: getCompassDirection,
        compareDistances: compareDistances,
        handleSignalSelect: handleSignalSelect,
        validSignals: validSignals,
        setValidSignals: setValidSignals,
        distanceToSignal: distanceToSignal,
        setDistanceToSignal: setDistanceToSignal,
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
        resetNavigation: resetNavigation,
      }}
    >
      {props.children}
    </WhiteFlagContext.Provider>
  );
};

export default WhiteFlagContext;
