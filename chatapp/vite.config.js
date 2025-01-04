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
  // If deploying on certain static hosts, you can enforce the base path
  // Uncomment below if you have a specific base URL (e.g., for GitHub Pages)
  // base: '/your-repository-name/',
});
