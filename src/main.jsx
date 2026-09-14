import React from "react";
import {createRoot} from "react-dom/client";
import WorldApp from "./world/WorldApp.jsx";
import baseCatalog from "../shared/catalog.js";
import assembledCatalog from "../shared/assembled-catalog.js";
import {scenes,years} from "../shared/world-model.js";
import "./styles.css";
import "./details.css";
import "./world/premium.css";

// Keep the historical SSOT shared by the immersive layer, contextual archive,
// tests, and Worker API. The legacy editorial experience remains accessible
// from inside WorldApp as the deep archive rather than the primary navigation.
Object.assign(baseCatalog, assembledCatalog);

// PWA shortcuts and shared links must open a real destination, not a decorative URL.
// We seed only valid scene/year values into the existing local profile; no data is erased.
try{
 const params=new URLSearchParams(window.location.search);
 const requestedScene=params.get('scene');
 const requestedYear=Number(params.get('year'));
 if(requestedScene&&scenes[requestedScene]){
  const key='wml-v3-profile';
  const stored=JSON.parse(localStorage.getItem(key)||'null')||{
   type:'anak-tv',completed:[],collections:[],visitedScenes:[],visitedYears:[],score:0,
   settings:{master:.7,ambience:.55,ui:.75,mute:false,intensity:'imersif'}
  };
  stored.scene=requestedScene;
  stored.visitedScenes=[...new Set([...(stored.visitedScenes||[]),requestedScene])];
  if(years.includes(requestedYear)){
   stored.year=requestedYear;
   stored.visitedYears=[...new Set([...(stored.visitedYears||[]),requestedYear])];
  }
  localStorage.setItem(key,JSON.stringify(stored));
 }
}catch{}

createRoot(document.getElementById("root")).render(
 <React.StrictMode><WorldApp/></React.StrictMode>
);

if('serviceWorker' in navigator){
 window.addEventListener('load',()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{}));
}
