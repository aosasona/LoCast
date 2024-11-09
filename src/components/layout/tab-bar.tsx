import { memo } from "react";
import { DownloadSimple, Gear, House, Icon } from "@phosphor-icons/react";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import Show from "../show";
import { useNavigate } from "@tanstack/react-router";

type Tab = {
	icon: Icon;
	size?: number;
	title: string | null;
	onClick: () => void;
};

function TabBar() {
	const navigate = useNavigate();

	const tabs = useMemo<Tab[]>(
		() => [
			{
				icon: House,
				title: "Home",
				size: 22,
				onClick: () => navigate({ to: "/" }),
			},
			{
				icon: DownloadSimple,
				title: "Downloads",
				size: 24,
				onClick: () => {},
			},
			{
				icon: Gear,
				title: "Settings",
				size: 22,
				onClick: () => {}, // TODO: implement settings page
			},
		],
		[]
	);

	return (
		<Box
			display={{ sm: "none" }}
			width="100vw"
			position="fixed"
			bottom="0"
			left="0"
			right="0"
			className="z-[999999] border-t border-t-gray bg-gray-50/80 backdrop-blur-lg tab-bar-padding">
			<Flex width="100%" align="center" px="4" className="justify-around">
				{tabs.map(({ icon: TabIcon, title, onClick, size }) => (
					<Button variant="ghost" color="gray" onClick={onClick} radius="large">
						<Flex direction="column" align="center" gap="1" p="1">
							<TabIcon size={size || 16} />
							<Show when={!!title}>
								<Text className="text-white text-xs">{title}</Text>
							</Show>
						</Flex>
					</Button>
				))}
			</Flex>
		</Box>
	);
}

export default memo(TabBar);
