import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Import main styles
import "./styles/main.scss";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
