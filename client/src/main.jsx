import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";

// Register Service Worker for offline support and caching
if ('serviceWorker' in navigator) {
  // Register from the public folder
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
  })
    .then((registration) => {
      console.log('✅ Service Worker registered:', registration);
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute
    })
    .catch((error) => {
      console.warn('⚠️ Service Worker registration failed:', error);
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
