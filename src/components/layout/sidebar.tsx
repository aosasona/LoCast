import { Box, Button, DropdownMenu, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { CaretRight, CaretLeft, SidebarSimple, Plus } from "@phosphor-icons/react";
import { useHotkeys } from "react-hotkeys-hook";
import Show from "@ui/show";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
	handleOpenYtImportModal: () => void;
};

export default function Sidebar(props: Props) {
	const [collapseSidebar, setCollapseSidebar] = useState(false);

	useHotkeys(["ctrl+s", "meta+s"], () => setCollapseSidebar(!collapseSidebar));
	useHotkeys(["meta+ArrowLeft", "ctrl+ArrowLeft"], goBack);
	useHotkeys(["meta+ArrowRight", "ctrl+ArrowRight"], goForward);

	function goBack() {
		toast.error("Not implemented yet");
	}

	function goForward() {
		toast.error("Not implemented yet");
	}

	return (
		<Box display={{ initial: "none", sm: "block" }}>
			<Flex direction="column" width={collapseSidebar ? "60px" : "240px"} p="2" className="h-full transition-all">
				<Box className="h-full bg-gray-100 rounded-md" p="3">
					<Flex direction="column" gap="3" align={collapseSidebar ? "center" : "start"} justify="center">
						<Flex align="center" justify={collapseSidebar ? "center" : "between"} gap="1" width="100%" mb="2">
							<Tooltip content={`${collapseSidebar ? "Expand" : "Collapse"} sidebar ⌘ s`}>
								<IconButton variant="ghost" size="2" onClick={() => setCollapseSidebar(!collapseSidebar)}>
									<SidebarSimple size={20} />
								</IconButton>
							</Tooltip>

							<Flex gap="4" display={collapseSidebar ? "none" : "flex"} hidden={collapseSidebar} className="transition-all">
								<Tooltip content="Go back ⌘ ←">
									<IconButton size="2" variant="ghost" onClick={goBack}>
										<CaretLeft />
									</IconButton>
								</Tooltip>
								<Tooltip content="Go forward ⌘ →">
									<IconButton size="2" variant="ghost" onClick={goForward}>
										<CaretRight />
									</IconButton>
								</Tooltip>
							</Flex>
						</Flex>

						<DropdownMenu.Root>
							<Show when={!collapseSidebar}>
								<DropdownMenu.Trigger>
									<Button className="w-full">
										Add to library
										<Plus />
									</Button>
								</DropdownMenu.Trigger>
							</Show>

							<Show when={collapseSidebar}>
								<DropdownMenu.Trigger>
									<IconButton variant="ghost" size="2">
										<Plus />
									</IconButton>
								</DropdownMenu.Trigger>
							</Show>
							<DropdownMenu.Content>
								<DropdownMenu.Item shortcut="⌘ i" onClick={props.handleOpenYtImportModal}>
									YouTube
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Flex>
				</Box>
			</Flex>
		</Box>
	);
}
