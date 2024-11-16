import { Box, Heading } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";

function Index() {
	return <Box>
		<Heading size="8">Home</Heading>
	</Box>
}

// TODO: load library
export const Route = createLazyFileRoute("/")({
	component: Index,
});
