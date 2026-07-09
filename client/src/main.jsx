import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import { BusinessDayProvider } from "./context/BusinessDayContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BusinessDayProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BusinessDayProvider>
  </StrictMode>
);