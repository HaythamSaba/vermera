import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted variable fonts: DM Sans (body, wght axis) and Fraunces
// (headings, wght + optical-size axes). Loaded before index.css so the
// @font-face rules exist when the --font-* tokens reference them.
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/fraunces/opsz.css";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
