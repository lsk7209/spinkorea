import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import App from "./App.tsx";
import { initializeAnalytics } from "./utils/analytics";

const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-KY5S8XFJFG";

void initializeAnalytics(gaMeasurementId);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
