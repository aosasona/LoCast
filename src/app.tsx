import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
import { StrictMode } from "react";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Toaster } from "sonner";

import { warn, debug, trace, info, error } from "@tauri-apps/plugin-log";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function forwardConsole(fnName: "log" | "debug" | "info" | "warn" | "error", logger: (message: string) => Promise<void>) {
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
	return (
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<Theme accentColor="lime" appearance="dark" radius="medium" grayColor="gray" scaling="95%">
					<RouterProvider router={router} />
					<Toaster />
				</Theme>
			</QueryClientProvider>
		</StrictMode>
	);
}
