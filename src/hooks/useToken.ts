import { useState } from "react";
import { LoginResponse } from "../components/authentication/Authenticate";

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString !== null) {
      const userToken = JSON.parse(tokenString);
      return userToken?.token;
    } else {
      return "";
    }
  };

  const saveToken = (loginToken: LoginResponse) => {
    localStorage.setItem("token", JSON.stringify(loginToken));
    setToken(loginToken.token);
  };

  const [token, setToken] = useState(getToken());

  return {
    setToken: saveToken,
    token,
  };
}
