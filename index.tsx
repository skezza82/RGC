
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Main Entry Point
 * Initializes the React application into the #root element.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("FATAL: Target container '#root' was not found in the DOM.");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("FAILED to mount React application:", error);
  }
}
