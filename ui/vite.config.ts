import path from "node:path";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		exclude: ["@electric-sql/pglite"],
	},
	worker: {
		format: "es",
	},
	plugins: [
		react(),
		TanStackRouterVite(),
		VitePWA({
			base: "/",
			registerType: "autoUpdate",
			injectRegister: "auto",

			// pwaAssets: {
			// 	disabled: false,
			// 	config: true,
			// },

			manifest: {
				name: "LoCast",
				short_name: "LoCast",
				description: "Listen to YouTube videos on the go!",
				theme_color: "#121212",
				icons: [
					{
						src: "pwa-64x64.png",
						sizes: "64x64",
						type: "image/png",
					},
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},

			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
			},

			// TODO: set enabled to false and suppressWarnings to true before production
			devOptions: {
				enabled: true,
				navigateFallback: "index.html",
				suppressWarnings: false,
				type: "module",
			},
		}),
	],

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
});
