import { appStore, ColorScheme, setColorScheme } from "$/lib/stores/app";
import { Box, Heading, SegmentedControl } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useSnapshot } from "valtio";

// https://youtu.be/C8r8kTyhbrU
function Settings() {
	const appState = useSnapshot(appStore)
	return (
		<Box width="100%" px={{ initial: "2", sm: "5" }} py={{ initial: "2", sm: "4" }}>
			<Box display={{ initial: "none", sm: "block" }}>
				<Heading size="8" >Settings</Heading>
			</Box>

			<Box mt="4" className="sm:max-w-md w-full rounded-md">
				<Heading size="2" color="gray">Appearance</Heading>
				<Box mt="2">
					<SegmentedControl.Root value={appState.colorScheme} onValueChange={v => setColorScheme(v as ColorScheme)}>
						<SegmentedControl.Item value="light">Light</SegmentedControl.Item>
						<SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
						<SegmentedControl.Item value="inherit">System</SegmentedControl.Item>
					</SegmentedControl.Root>
				</Box>
			</Box>
		</Box>
	);
}

export const Route = createLazyFileRoute("/settings")({
	component: Settings,
});
