import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import App from "./App.tsx";

const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-KY5S8XFJFG";

const initializeAnalytics = () => {
  void import("react-ga4").then(({ default: ReactGA }) => {
    ReactGA.initialize(gaMeasurementId);
  });
};

window.setTimeout(initializeAnalytics, 0);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
