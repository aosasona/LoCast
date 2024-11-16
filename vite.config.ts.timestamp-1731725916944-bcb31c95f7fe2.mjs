// vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///Users/ayodeji/Developer/LoCast/node_modules/.pnpm/vite@5.4.11_@types+node@22.9.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/ayodeji/Developer/LoCast/node_modules/.pnpm/@vitejs+plugin-react@4.3.3_vite@5.4.11_@types+node@22.9.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { TanStackRouterVite } from "file:///Users/ayodeji/Developer/LoCast/node_modules/.pnpm/@tanstack+router-plugin@1.81.9_vite@5.4.11_@types+node@22.9.0_/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
var __vite_injected_original_dirname = "/Users/ayodeji/Developer/LoCast";
var host = process.env.TAURI_DEV_HOST;
var vite_config_default = defineConfig(async () => ({
  plugins: [react(), TanStackRouterVite()],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? {
      protocol: "ws",
      host,
      port: 1421
    } : void 0,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"]
    }
  },
  resolve: {
    alias: {
      $: path.resolve(__vite_injected_original_dirname, "src"),
      "@ui": path.resolve(__vite_injected_original_dirname, "src/components"),
      "@lib": path.resolve(__vite_injected_original_dirname, "src/lib"),
      "@stores": path.resolve(__vite_injected_original_dirname, "src/stores"),
      "@assets": path.resolve(__vite_injected_original_dirname, "src/assets"),
      "@images": path.resolve(__vite_injected_original_dirname, "src/assets/images")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXlvZGVqaS9EZXZlbG9wZXIvTG9DYXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXlvZGVqaS9EZXZlbG9wZXIvTG9DYXN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9heW9kZWppL0RldmVsb3Blci9Mb0Nhc3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSBcIkB0YW5zdGFjay9yb3V0ZXItcGx1Z2luL3ZpdGVcIjtcblxuY29uc3QgaG9zdCA9IHByb2Nlc3MuZW52LlRBVVJJX0RFVl9IT1NUO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGFzeW5jICgpID0+ICh7XG5cdHBsdWdpbnM6IFtyZWFjdCgpLCBUYW5TdGFja1JvdXRlclZpdGUoKV0sXG5cblx0Ly8gVml0ZSBvcHRpb25zIHRhaWxvcmVkIGZvciBUYXVyaSBkZXZlbG9wbWVudCBhbmQgb25seSBhcHBsaWVkIGluIGB0YXVyaSBkZXZgIG9yIGB0YXVyaSBidWlsZGBcblx0Ly9cblx0Ly8gMS4gcHJldmVudCB2aXRlIGZyb20gb2JzY3VyaW5nIHJ1c3QgZXJyb3JzXG5cdGNsZWFyU2NyZWVuOiBmYWxzZSxcblx0Ly8gMi4gdGF1cmkgZXhwZWN0cyBhIGZpeGVkIHBvcnQsIGZhaWwgaWYgdGhhdCBwb3J0IGlzIG5vdCBhdmFpbGFibGVcblx0c2VydmVyOiB7XG5cdFx0cG9ydDogMTQyMCxcblx0XHRzdHJpY3RQb3J0OiB0cnVlLFxuXHRcdGhvc3Q6IGhvc3QgfHwgZmFsc2UsXG5cdFx0aG1yOiBob3N0XG5cdFx0XHQ/IHtcblx0XHRcdFx0XHRwcm90b2NvbDogXCJ3c1wiLFxuXHRcdFx0XHRcdGhvc3QsXG5cdFx0XHRcdFx0cG9ydDogMTQyMSxcblx0XHRcdFx0fVxuXHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0d2F0Y2g6IHtcblx0XHRcdC8vIDMuIHRlbGwgdml0ZSB0byBpZ25vcmUgd2F0Y2hpbmcgYHNyYy10YXVyaWBcblx0XHRcdGlnbm9yZWQ6IFtcIioqL3NyYy10YXVyaS8qKlwiXSxcblx0XHR9LFxuXHR9LFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxuXHRcdFx0XCJAdWlcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvY29tcG9uZW50c1wiKSxcblx0XHRcdFwiQGxpYlwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9saWJcIiksXG5cdFx0XHRcIkBzdG9yZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvc3RvcmVzXCIpLFxuXHRcdFx0XCJAYXNzZXRzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2Fzc2V0c1wiKSxcblx0XHRcdFwiQGltYWdlc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9hc3NldHMvaW1hZ2VzXCIpLFxuXHRcdH0sXG5cdH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStRLE9BQU8sVUFBVTtBQUNoUyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsU0FBUywwQkFBMEI7QUFIbkMsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTSxPQUFPLFFBQVEsSUFBSTtBQUd6QixJQUFPLHNCQUFRLGFBQWEsYUFBYTtBQUFBLEVBQ3hDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUt2QyxhQUFhO0FBQUE7QUFBQSxFQUViLFFBQVE7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE1BQU0sUUFBUTtBQUFBLElBQ2QsS0FBSyxPQUNGO0FBQUEsTUFDQSxVQUFVO0FBQUEsTUFDVjtBQUFBLE1BQ0EsTUFBTTtBQUFBLElBQ1AsSUFDQztBQUFBLElBQ0gsT0FBTztBQUFBO0FBQUEsTUFFTixTQUFTLENBQUMsaUJBQWlCO0FBQUEsSUFDNUI7QUFBQSxFQUNEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixHQUFHLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDaEMsT0FBTyxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDL0MsUUFBUSxLQUFLLFFBQVEsa0NBQVcsU0FBUztBQUFBLE1BQ3pDLFdBQVcsS0FBSyxRQUFRLGtDQUFXLFlBQVk7QUFBQSxNQUMvQyxXQUFXLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDL0MsV0FBVyxLQUFLLFFBQVEsa0NBQVcsbUJBQW1CO0FBQUEsSUFDdkQ7QUFBQSxFQUNEO0FBQ0QsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
