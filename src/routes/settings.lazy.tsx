import { Box, Heading } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";

// https://youtu.be/C8r8kTyhbrU
function Settings() {
	return (
		<Box px="2" py="2">
			<Heading size="8">Settings</Heading>

			<Box mt="4"></Box>
		</Box>
	);
}

export const Route = createLazyFileRoute("/settings")({
	component: Settings,
});
