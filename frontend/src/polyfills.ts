/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 */

// Polyfill for process in browser
(window as any).process = {
  env: { NODE_ENV: 'production' }
};

// Empty implementations for Node.js modules
(window as any).global = window; 