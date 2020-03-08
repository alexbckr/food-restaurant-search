import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleGJja3IiLCJhIjoiY2s3NmFkZjBpMTdjejNlcDcyczdsN201NiJ9.QYs97ffvTiEV1GpcH83hMw";

ReactDOM.render(<App />, document.getElementById("root"));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
