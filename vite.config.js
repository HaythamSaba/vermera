import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Splits the vendor libraries that every route needs anyway out of
        // the main entry chunk (which the build already warns is >500 kB)
        // and into their own cacheable chunks — react/router/redux rarely
        // change between deploys, so a returning visitor's browser can keep
        // reusing this chunk across app-code updates instead of
        // re-downloading it inside a newly-hashed bundle every time.
        manualChunks: {
          "react-vendor": [
            "react",
            "react-dom",
            "react-router",
            "react-router-dom",
          ],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
        },
      },
    },
  },
});
