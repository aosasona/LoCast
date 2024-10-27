import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
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
		hmr: host
			? {
					protocol: "ws",
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ["**/src-tauri/**"],
		},
	},
	resolve: {
		alias: {
			$: path.resolve(__dirname, "src"),
			"@ui": path.resolve(__dirname, "src/components"),
			"@lib": path.resolve(__dirname, "src/lib"),
			"@stores": path.resolve(__dirname, "src/stores"),
			"@assets": path.resolve(__dirname, "src/assets"),
			"@images": path.resolve(__dirname, "src/assets/images"),
		},
	},
}));
