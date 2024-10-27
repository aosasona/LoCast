import { radixThemePreset } from "radix-themes-tw";
/** @type {import('tailwindcss').Config} */
export default {
	presets: [radixThemePreset],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				dark: "hsl(var(--color-dark))",
				body: "hsl(var(--color-body))",
				accent: {
					50: "var(--accent-1)",
					100: "var(--accent-2)",
					200: "var(--accent-3)",
					300: "var(--accent-4)",
					400: "var(--accent-5)",
					500: "var(--accent-6)",
					600: "var(--accent-7)",
					700: "var(--accent-8)",
					800: "var(--accent-9)",
					900: "var(--accent-10)",
					950: "var(--accent-11)",
					dark: "var(--accent-12)",
					surface: "var(--accent-surface)",
					indicator: "var(--accent-indicator)",
					track: "var(--accent-track)",
					contrast: "var(--accent-contrast)",
				},
				gray: {
					50: "var(--gray-1)",
					100: "var(--gray-2)",
					200: "var(--gray-3)",
					300: "var(--gray-4)",
					400: "var(--gray-5)",
					500: "var(--gray-6)",
					600: "var(--gray-7)",
					700: "var(--gray-8)",
					800: "var(--gray-9)",
					900: "var(--gray-10)",
					950: "var(--gray-11)",
					dark: "var(--gray-12)",
				},
			},
		},
	},
	plugins: ["postcss-import"],
};
