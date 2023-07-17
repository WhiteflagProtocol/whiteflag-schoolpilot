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

  const [token, setToken] = useState<string>(getToken());
  const [address, setAddress] = useState<string>(getAddress());

  return {
    address,
    setAddress: saveAddress,
    setToken: saveToken,
    token,
  };
}
