import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@components", replacement: "/src/components" },
      { find: "@hooks", replacement: "/src/hooks" },
      { find: "@store", replacement: "/src/store" },
      { find: "@types", replacement: "/src/types" },
      { find: "@features", replacement: "/src/features" },
      { find: "@utils", replacement: "/src/utils" },
      { find: "@layouts", replacement: "/src/layouts" },
      { find: "@assets", replacement: "/src/assets" },
      { find: "@constants", replacement: "/src/constants" },
    ],
  },
  server: {
    port: 3000,
    open: true,
  },
});
