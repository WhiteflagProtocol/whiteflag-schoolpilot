import { ConfigProvider } from "antd";
import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Authenticate } from "./components/authentication/Authenticate";
import { WhiteflagLayout } from "./components/layout/WhiteflagLayout";
import { SignalsList } from "./components/signals/SignalsList";
import WhiteFlagContext from "./helpers/Context";
import "./styles/main.scss";

function App() {
  const context = useContext(WhiteFlagContext);

  if (!context.token) {
    return (
      <Authenticate
        setToken={context.setToken}
        setAddress={context.setAddress}
      />
    );
  }

  return (
    <div className="App" style={{ overflowY: "hidden" }}>
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
              colorBgContainer: "#25292D", // default button bg color (dark gray)
              colorText: "#FFFFFF", // text color default button
              colorPrimaryHover: "#A1D2FF",
              colorTextLightSolid: "#000000",
            },
            Modal: {
              colorBgElevated: "#25292D",
            },
            Input: {
              colorBorderBg: "#25292D",
              colorBgContainer: "#25292D",
              colorBorder: "#9FA3AD",
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
