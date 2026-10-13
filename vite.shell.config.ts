import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Builds src/shell.tsx for Node so scripts/prerender-seo.mjs can render the
// home page's menu and hero into dist/index.html (see src/shell.tsx).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    ssr: "src/shell.tsx",
    outDir: "dist-shell",
    emptyOutDir: true,
  },
});
