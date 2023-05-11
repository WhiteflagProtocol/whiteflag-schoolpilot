import { useState } from "react";
import "./App.css";
import { WhiteflagLayout } from "./components/layout/WhiteflagLayout";
import { SignalsList } from "./components/signals/SignalsList";
import logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <WhiteflagLayout>
        <SignalsList />
      </WhiteflagLayout>
    </div>
  );
}

export default App;
