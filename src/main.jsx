import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import baseCatalog from "../shared/catalog.js";
import assembledCatalog from "../shared/assembled-catalog.js";
import "./styles.css";
import "./details.css";

// App.jsx imports the base object directly. Mutating that shared object before
// the first render keeps the frontend and Worker on the same assembled dataset
// without duplicating the large historical catalog file.
Object.assign(baseCatalog, assembledCatalog);

createRoot(document.getElementById("root")).render(
 <React.StrictMode><App/></React.StrictMode>
);
