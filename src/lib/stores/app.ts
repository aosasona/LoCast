import { proxy } from "valtio";

export const ACCENT_COLORS = [
	"gray",
	"gold",
	"bronze",
	"brown",
	"yellow",
	"amber",
	"orange",
	"tomato",
	"red",
	"ruby",
	"crimson",
	"pink",
	"plum",
	"purple",
	"violet",
	"iris",
	"indigo",
	"blue",
	"cyan",
	"teal",
	"jade",
	"green",
	"grass",
	"lime",
	"mint",
	"sky",
] as const;

const GRAY_COLORS = [
	"auto",
	"gray",
	"mauve",
	"slate",
	"sage",
	"olive",
	"sand",
] as const;

export type ColorScheme = "inherit" | "light" | "dark";
export type AccentColor = (typeof ACCENT_COLORS)[number];
export type GrayColor = (typeof GRAY_COLORS)[number];

export type AppStore = {
	colorScheme: ColorScheme;
	accentColor: AccentColor;
	grayColor: GrayColor;
	systemPreference: Omit<ColorScheme, "inherit"> | null;
};

function loadDefaultState(): AppStore {
	const defaultValues: AppStore = {
		colorScheme: "dark",
		accentColor: "tomato",
		grayColor: "gray",
		systemPreference: null,
	}

	if (typeof localStorage === "undefined") {
		return defaultValues;
	}

	if (localStorage.getItem("appStore") === null) {
		return defaultValues;
	}

	const stored = JSON.parse(localStorage.getItem("appStore")!) as AppStore;
	return {
		...defaultValues,
		...stored,
	};
}

function saveState() {
	if (typeof localStorage !== "undefined") {
		localStorage.setItem("appStore", JSON.stringify(appStore));
	}
}

const appStore = proxy<AppStore>(loadDefaultState());

function setAccentColor(color: AccentColor) {
	appStore.accentColor = color;
	saveState();
}

function setColorScheme(scheme: ColorScheme) {
	appStore.colorScheme = scheme;
	saveState();
}

function setgrayColor(color: GrayColor) {
	appStore.grayColor = color;
	saveState();
}

export { appStore, setAccentColor, setColorScheme, setgrayColor };
