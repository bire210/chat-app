import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensures proper routing for development
    historyApiFallback: true,
  },
  build: {
    // Ensures proper routing for production
    rollupOptions: {
      input: "/index.html",
    },
  },
});
