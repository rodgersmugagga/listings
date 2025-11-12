import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";

// Service worker registration removed to avoid stale cached assets in production.
// Proactively attempt to unregister any existing service workers on app load so
// previously-controlled clients stop serving stale cached assets immediately.
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  // best-effort: ignore errors and continue boot
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => {
      registrations.forEach((reg) => {
        // unregister returns a promise; swallow any promise errors
        reg.unregister().catch(() => {});
      });
    })
    .catch(() => {
      /* ignore */
    });
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
