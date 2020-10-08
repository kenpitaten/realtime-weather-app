import React from "react";
import ReactDOM from "react-dom";
import WeatherApp from "./WeatherApp";

import "./styles.css";

const rootElement = document.getElementById("root");

function App() {
  return <WeatherApp />;
}

ReactDOM.render(<App />, rootElement);
