import {
  BrowserRouter,
  Route,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";
import { Authenticate } from "./components/authentication/Authenticate";
import { WhiteflagLayout } from "./components/layout/WhiteflagLayout";
import { SignalsList } from "./components/signals/SignalsList";
import { useState } from "react";

function App() {
  const [token, setToken] = useState<string>("");

  console.log(token);

  if (!token) {
    return <Authenticate setToken={setToken} />;
  }

  return (
    <div className="App">
      <WhiteflagLayout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignalsList />} />
            {/* <Route path="/auth" element={<Authenticate />} /> */}
          </Routes>
        </BrowserRouter>
      </WhiteflagLayout>
    </div>
  );
}

export default App;
