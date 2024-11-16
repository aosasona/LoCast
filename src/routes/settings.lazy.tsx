import Show from "$/components/show";
import { ACCENT_COLORS, appStore, ColorScheme, setAccentColor, setColorScheme } from "$/lib/stores/app";
import { Check } from "@phosphor-icons/react";
import { Box, Card, Flex, Grid, Heading, SegmentedControl, Tooltip } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useSnapshot } from "valtio";

// https://youtu.be/C8r8kTyhbrU
function Settings() {
	const appState = useSnapshot(appStore)

	return (
		<Box width="100%" px={{ initial: "4", sm: "5" }} py={{ initial: "1", sm: "4" }}>
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

			<Box mt="4" className="sm:max-w-md w-full rounded-md">
				<Heading size="2" color="gray">Accent color</Heading>
				<Card mt="2">
					<Grid columns="9" gap="3" rows="auto" width="auto">
						{ACCENT_COLORS.map((color) => (
							<Tooltip content={color.toLocaleUpperCase()}>
								<Box
									key={color}
									className="relative w-full aspect-square rounded-md hover:cursor-pointer hover:opacity-80 overflow-clip"
									onClick={() => setAccentColor(color)}
									style={{ backgroundColor: `var(--${color}-9)`, border: appState.accentColor === color ? `4px solid var(--${color}-6)` : "" }}
								>
									<Show when={appState.accentColor === color}>
										<Flex position="absolute" top="0" bottom="0" right="0" left="0" width="100%" height="100%" align="center" justify="center" className="bg-neutral-100/70 dark:bg-neutral-900/70">
											<Check size={18} />
										</Flex>
									</Show>
								</Box>
							</Tooltip>
						))}
					</Grid>
				</Card>
			</Box>
		</Box>
	);
}

export const Route = createLazyFileRoute("/settings")({
	component: Settings,
});
