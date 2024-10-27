import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
import { StrictMode } from "react";
import { PGliteProvider } from "@lib/database/provider";
import database from "@lib/database";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Toaster } from "sonner";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default function App() {
	// TODO: run migrations and indicate when this is going on

	return (
		<StrictMode>
			<PGliteProvider db={database}>
				<Theme accentColor="lime" appearance="dark" radius="medium" grayColor="gray">
					<RouterProvider router={router} />
					<Toaster />
				</Theme>
			</PGliteProvider>
		</StrictMode>
	);
}
