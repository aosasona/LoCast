import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
import { StrictMode, useCallback, useEffect, useState } from "react";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Toaster } from "sonner";

import { warn, debug, trace, info, error } from "@tauri-apps/plugin-log";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { subscribe, useSnapshot } from "valtio";
import { appStore, ColorScheme } from "@lib/stores/app";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function forwardConsole(
	fnName: "log" | "debug" | "info" | "warn" | "error",
	logger: (message: string) => Promise<void>,
) {
	const original = console[fnName];
	console[fnName] = (message) => {
		original(message);
		logger(message);
	};
}

forwardConsole("log", trace);
forwardConsole("debug", debug);
forwardConsole("info", info);
forwardConsole("warn", warn);
forwardConsole("error", error);

const queryClient = new QueryClient();


export default function App() {
	const appState = useSnapshot(appStore);

	function handleColorSchemeChange(e: MediaQueryListEvent) {
		document.documentElement.classList.remove("light", "dark");

		if (appStore.colorScheme === "inherit") {
			const systemColorScheme = e.matches ? "dark" : "light";
			document.documentElement.classList.add(systemColorScheme);
		}
	}

	// React to colorscheme changes
	useEffect(() => {
		// Watch for changes in the color scheme
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleColorSchemeChange);

		// Dispatch the initial color scheme change event on startup
		handleColorSchemeChange({ matches: window.matchMedia("(prefers-color-scheme: dark)").matches } as MediaQueryListEvent);

		const unsubscribe = subscribe(appStore, (_) => {
			// Dispatch the initial color scheme change event
			handleColorSchemeChange({ matches: window.matchMedia("(prefers-color-scheme: dark)").matches } as MediaQueryListEvent);
		});

		return () => {
			window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handleColorSchemeChange);
			unsubscribe();
		};
	}, []);

	return (
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<Theme
					hasBackground={false}
					accentColor={appState.accentColor}
					appearance={appState.colorScheme}
					radius="medium"
					grayColor={appState.grayColor}
					scaling="95%"
				>
					<RouterProvider router={router} />
					<Toaster richColors theme="light" style={{ zIndex: 9999999 }} />
				</Theme>
			</QueryClientProvider>
		</StrictMode>
	);
}
