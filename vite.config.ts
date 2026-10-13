import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Register the service worker without blocking the first paint
      injectRegister: "script-defer",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      manifest: false,
      injectManifest: {
        // Code, pages and fonts work offline; images are cached as they are viewed (see src/sw.ts)
        globPatterns: ["**/*.{js,css,html,woff2}", "favicon-96.png", "nova-icon-192.png", "images/logo-nova-light.webp"],
        // Staff-only page: don't make every visitor download it in the background
        globIgnores: ["**/Admin-*.js"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
