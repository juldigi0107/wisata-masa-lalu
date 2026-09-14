import React from "react";
import {createRoot} from "react-dom/client";
import WorldApp from "./world/WorldApp.jsx";
import baseCatalog from "../shared/catalog.js";
import assembledCatalog from "../shared/assembled-catalog.js";
import "./styles.css";
import "./details.css";

// Keep the historical SSOT shared by the immersive layer, contextual archive,
// tests, and Worker API. The legacy editorial experience remains accessible
// from inside WorldApp as the deep archive rather than the primary navigation.
Object.assign(baseCatalog, assembledCatalog);

createRoot(document.getElementById("root")).render(
 <React.StrictMode><WorldApp/></React.StrictMode>
);

if('serviceWorker' in navigator){
 window.addEventListener('load',()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{}));
}
