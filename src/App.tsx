import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Authenticate } from "./components/authentication/Authenticate";
import { WhiteflagLayout } from "./components/layout/WhiteflagLayout";
import { SignalsList } from "./components/signals/SignalsList";
import useToken from "./hooks/useToken";
import "./styles/main.scss";

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Authenticate setToken={setToken} />;
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
            colorTextSecondary: "#A3A3A3",
            colorTextTertiary: "#A3A3A3",
            colorTextLabel: "#A3A3A3",
            fontFamily: "Roboto, sans-serif",
            fontSizeHeading4: 18,
            colorTextHeading: "#FFFFFF",
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
              colorPrimary: "#FFFFFF", // primary button bg color (white)
              colorBgContainer: "#353941", // default button bg color (dark gray)
              colorText: "#FFFFFF", // text color default button
              colorPrimaryHover: "#A1D2FF",
              colorTextLightSolid: "#000000",
            },
            Modal: {
              colorBgElevated: "#353941",
            },
            Input: {
              colorBorderBg: "#353941",
              colorBgContainer: "#353941",
              colorBorder: "#A3A3A3",
              colorPrimaryHover: "#A1D2FF", // border color when selet input
            },
            Select: {
              colorBorderBg: "#353941",
              colorBgContainer: "#353941",
              colorBorder: "#A3A3A3",
              colorBgElevated: "#353941",
              controlItemBgActive: "#4E545F",
              colorTextPlaceholder: "rgba(250, 250, 250, 0.5)",
              colorTextQuaternary: "#FFFFFF",
            },
            Drawer: {
              colorBgElevated: "#1B1D21",
              colorTextLabel: "#A3A3A3",
              colorIcon: "#FFFFFF",
            },
            Typography: {
              colorLink: "#FFFFFF",
            },
            Collapse: {
              colorBgContainer: "#25292D",
              colorFillAlter: "#25292D",
              colorBorder: "#25292D",
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
