import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Authenticate, Token } from "./components/authentication/Authenticate";
import { WhiteflagLayout } from "./components/layout/WhiteflagLayout";
import { SignalsList } from "./components/signals/SignalsList";
import { useState } from "react";
import { ConfigProvider } from "antd";
import useToken from "./hooks/useToken";
import "./styles/main.scss";

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Authenticate setToken={setToken} />;
  }

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1186CE",
            fontSizeHeading1: 22,
            fontSizeHeading2: 20,
            fontSizeHeading5: 14,
            lineHeightHeading1: 1.2,
            lineHeightHeading2: 1.2,
            lineHeightHeading5: 1.28,
            fontSize: 16,
            fontSizeIcon: 20,
            colorText: "#FFFFFF",
            lineHeight: 1.6,
            colorTextSecondary: "#A3A3A3",
            colorTextTertiary: "#A3A3A3",
            colorTextLabel: "#A3A3A3",
            fontFamily: "Roboto, sans-serif",
          },
          components: {
            Layout: {
              colorBgBody: "#1B1D21",
              colorTextLabel: "#A3A3A3",
            },
            Card: {
              colorBorderBg: "#353941",
              colorBorder: "#353941",
              colorBgContainer: "#353941",
            },
            Button: {
              colorBgBase: "#353941",
              colorBgLayout: "#353941",
              colorPrimary: "#FFFFFF",
              colorPrimaryText: "#000000",
              colorText: "#000000",
              colorFillSecondary: "#353941",
            },
            Modal: {
              colorBgElevated: "#353941",
            },
            Input: {
              colorBorderBg: "#353941",
              colorBgContainer: "#353941",
              colorBorder: "#A3A3A3",
            },
            Select: {
              colorBorderBg: "#353941",
              colorBgContainer: "#353941",
              colorBorder: "#A3A3A3",
              colorBgElevated: "#353941",
              controlItemBgActive: "#4E545F",
            },
            Drawer: {
              colorBgElevated: "#1B1D21",
              colorTextLabel: "#A3A3A3",
              colorIcon: "#FFFFFF",
            },
          },
        }}
      >
        <WhiteflagLayout>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignalsList />} />
            </Routes>
          </BrowserRouter>
        </WhiteflagLayout>
      </ConfigProvider>
    </div>
  );
}

export default App;
