import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ allows "@/..." imports
    },
  },
  server: {
    port: 5173, // optional: you can change the port if needed
    open: true, // optional: auto-opens browser
    historyApiFallback: true, // ✅ this is the MAIN FIX
  },
  preview: {
    historyApiFallback: true, // ✅ also for production preview
  },
});
