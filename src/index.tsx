import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Import WK Theme CSS
import "@wk/theme/assets/utilities/_colors-variables.scss";
import "@wk/theme/assets/utilities/_fonts.scss";
import "@wk/theme/assets/utilities/_mixins.scss";
import "@wk/theme/assets/utilities/_helpers.scss";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
