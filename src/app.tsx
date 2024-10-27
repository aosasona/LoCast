import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
import { StrictMode } from "react";

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
			<Theme accentColor="lime" appearance="dark" radius="medium" grayColor="gray" scaling="95%">
				<RouterProvider router={router} />
				<Toaster />
			</Theme>
		</StrictMode>
	);
}
