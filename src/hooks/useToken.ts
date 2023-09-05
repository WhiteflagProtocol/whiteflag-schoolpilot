import { useState } from "react";
import {
  Address,
  LoginResponse,
} from "../components/authentication/Authenticate";

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString !== null) {
      const userToken: LoginResponse = JSON.parse(tokenString);
      return userToken?.token;
    } else {
      return "";
    }
  };

  const saveToken = (loginToken: LoginResponse) => {
    localStorage.setItem("token", JSON.stringify(loginToken));
    setToken(loginToken.token);
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

  const [token, setToken] = useState<string>(getToken());
  const [address, setAddress] = useState<string>(getAddress());

  return {
    address,
    removeAddress,
    removeToken,
    setAddress: saveAddress,
    setToken: saveToken,
    token,
  };
}
