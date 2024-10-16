import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178,
    proxy: {
      "/auth": "http://localhost:3000",
      "/api": "http://localhost:5179",
    },
  },
});
