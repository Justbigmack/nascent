import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router": ["@tanstack/react-router"],
          "query": ["@tanstack/react-query"],
          "i18n": ["i18next", "react-i18next"],
          "icons": ["lucide-react"],
          "ui-radix": [
            "@radix-ui/react-label",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
          ],
          "forms": ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/orderbook": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/trade": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
