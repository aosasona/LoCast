import { Gear, House, Icon, Plus } from "@phosphor-icons/react";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import Show from "../show";
import { useNavigate } from "@tanstack/react-router";

type Props = {
	handleOpenYtImportModal: () => void;
};

type Tab = {
	icon: Icon;
	size?: number;
	title: string | null;
	onClick: () => void;
};

export function TabBar(props: Props) {
	const navigate = useNavigate();

	const tabs = useMemo<Tab[]>(
		() => [
			{
				icon: House,
				title: "Home",
				size: 20,
				onClick: () => navigate({ to: "/" }),
			},
			{
				icon: Plus,
				title: "Import",
				size: 18,
				onClick: props.handleOpenYtImportModal,
			},
			{
				icon: Gear,
				title: "Settings",
				size: 20,
				onClick: () => {}, // TODO: implement settings page
			},
		],
		[]
	);
	return (
		<Box display={{ sm: "none" }} width="100dvw" position="fixed" bottom="0" className="pb-safe-bottom">
			<Flex width="100%" align="center" p="4" className="bg-gray-100 justify-evenly">
				{tabs.map(({ icon: TabIcon, title, onClick, size }) => (
					<Button variant="ghost" color="gray" onClick={onClick}>
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
