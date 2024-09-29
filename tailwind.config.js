import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				dark: "hsl(var(--color-dark))",
				body: "hsl(var(--color-body))",
				primary: colors["lime"],
			},
		},
	},
	plugins: [],
};
