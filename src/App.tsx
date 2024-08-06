import { ConfigProvider } from "antd";
import { useContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Authenticate } from "./components/authentication/Authenticate";
import { WhiteflagLayout } from "./components/layout/WhiteflagLayout";
import MapsOverlay from "./components/maps/MapOverlay";
import { SignalsList } from "./components/signals/SignalsList";
import Disclaimer from "./components/disclaimer/Disclaimer";
import WhiteFlagContext from "./helpers/Context";
import "./styles/main.scss";
import { theme } from "./theme";
import { SearchPanel } from "./components/search/SearchPanel";

function App() {
  const context = useContext(WhiteFlagContext);

  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const ctx = useContext(WhiteFlagContext);
  window.addEventListener("offline", () => {
    setOnline(false);
  });

  window.addEventListener("online", () => {
    setOnline(true);
  });

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
        theme={theme}
      >
        {!context.token && online ? (
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
                <Route path="/search" element={<SearchPanel />} />
              </Routes>
            </BrowserRouter>
          </WhiteflagLayout>
        )}
      </ConfigProvider>
    </div>
  );
}

export default App;
