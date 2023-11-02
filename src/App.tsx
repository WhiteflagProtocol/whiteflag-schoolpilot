import { ConfigProvider } from "antd";
import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Authenticate } from "./components/authentication/Authenticate";
import { WhiteflagLayout } from "./components/layout/WhiteflagLayout";
import MapsOverlay from "./components/maps/MapOverlay";
import { SignalsList } from "./components/signals/SignalsList";
import Disclaimer from "./components/disclaimer/Disclaimer";
import WhiteFlagContext from "./helpers/Context";
import "./styles/main.scss";

function App() {
  const context = useContext(WhiteFlagContext);

  return (
    <div
      className="App"
      style={{
        overflowY: "hidden",
        overflowX: "hidden",
        backgroundColor: "#090A0B",
      }}
    >
      <ConfigProvider
        // for token keys, see: https://ant.design/theme-editor
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
            colorTextSecondary: "#9FA3AD",
            colorTextTertiary: "#9FA3AD",
            colorTextLabel: "#9FA3AD",
            fontFamily: "Roboto, sans-serif",
            fontSizeHeading4: 18,
            colorTextHeading: "#FFFFFF",
            colorLinkHover: "#efefef",
            colorLinkActive: "#efefef",
          },
          components: {
            Layout: {
              colorBgBody: "#090A0B",
              colorTextLabel: "#9FA3AD",
            },
            Card: {
              colorBorderBg: "#25292D",
              colorBorder: "#25292D",
              colorBgContainer: "#25292D",
            },
            Button: {
              colorPrimary: "#FFFFFF", // primary button bg color (white)
              colorBgContainer: "#FFFFFF", // default button bg color (dark gray)
              colorText: "#000000", // text color default button
              colorPrimaryHover: "#A1D2FF",
              colorTextLightSolid: "#000000",
            },
            Modal: {
              colorBgElevated: "#25292D",
            },
            Input: {
              colorBorderBg: "#A3A3A3",
              colorBgContainer: "#00000000",
              colorBorder: "#A3A3A3",
              colorPrimaryHover: "#A1D2FF",
            },
            Select: {
              colorBorderBg: "#25292D",
              colorBgContainer: "#25292D",
              colorBorder: "#9FA3AD",
              colorBgElevated: "#25292D",
              controlItemBgActive: "#4E545F",
              colorTextPlaceholder: "rgba(250, 250, 250, 0.5)",
              colorTextQuaternary: "#FFFFFF",
            },
            Drawer: {
              colorBgElevated: "#1B1D21",
              colorTextLabel: "#9FA3AD",
              colorIcon: "#FFFFFF",
            },
            Typography: {
              colorLink: "#FFFFFF",
            },
            Collapse: {
              colorBgContainer: "#12f70a",
            },
          },
        }}
      >
        {!context.token ? (
          <Authenticate
            setToken={context.setToken}
            setAddress={context.setAddress}
          />
        ) : (
          <WhiteflagLayout>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<SignalsList />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/maps" element={<MapsOverlay />} />
              </Routes>
            </BrowserRouter>
          </WhiteflagLayout>
        )}
      </ConfigProvider>
    </div>
  );
}

export default App;
