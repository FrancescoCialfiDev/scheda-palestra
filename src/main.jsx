import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./style/globals.css";
import { SheetsProvider } from "./context/SheetsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SheetsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SheetsProvider>
  </StrictMode>
);
