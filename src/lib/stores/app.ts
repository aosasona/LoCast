import { proxy } from "valtio";

const ACCENT_COLORS = [
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

type ColorScheme = "inherit" | "light" | "dark";
type AccentColor = (typeof ACCENT_COLORS)[number];
type GrayColor = (typeof GRAY_COLORS)[number];

type AppStore = {
	colorScheme: ColorScheme;
	accentColor: AccentColor;
	grayColor: GrayColor;
};

const appStore = proxy<AppStore>({
	colorScheme: "dark",
	accentColor: "tomato",
	grayColor: "gray",
});

function setAccentColor(color: AccentColor) {
	appStore.accentColor = color;
}

function setColorScheme(scheme: ColorScheme) {
	appStore.colorScheme = scheme;
}

function setgrayColor(color: GrayColor) {
	appStore.grayColor = color;
}

export { appStore, setAccentColor, setColorScheme, setgrayColor };
