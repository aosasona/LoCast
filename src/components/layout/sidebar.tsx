import { useState, memo, useCallback } from "react";
import { Box, Button, DropdownMenu, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { CaretRight, CaretLeft, SidebarSimple, Plus, Gear, Code } from "@phosphor-icons/react";
import { useHotkeys } from "react-hotkeys-hook";
import Show from "@ui/show";
import { toast } from "sonner";
import { toggleImportingFromYouTube } from "$/lib/stores/import";
import { useNavigate } from "@tanstack/react-router";

const SMALL_SIDEBAR_WIDTH = "72px";

function Sidebar() {
	const navigate = useNavigate();
	const [collapseSidebar, setCollapseSidebar] = useState(false);

	useHotkeys(["ctrl+s", "meta+s"], () => setCollapseSidebar(!collapseSidebar));
	useHotkeys(["meta+ArrowLeft", "ctrl+ArrowLeft"], goBack);
	useHotkeys(["meta+ArrowRight", "ctrl+ArrowRight"], goForward);

	const withCollapsedState = useCallback((fallback: string) => {
		return collapseSidebar ? SMALL_SIDEBAR_WIDTH : fallback;
	}, [collapseSidebar]);

	function goBack() {
		toast.error("Not implemented yet");
	}

	function goForward() {
		toast.error("Not implemented yet");
	}

	return (
		<Box display={{ initial: "none", sm: "block" }}>
			<Box
				minWidth="60px"
				width={{
					sm: withCollapsedState("21vw"),
					xl: withCollapsedState("250px"),
				}}
				p={{ sm: "3", lg: "2" }}
				className="h-full transition-all">
				<Flex direction="column" height="100%" className="bg-gray-100 rounded-md border border-gray">
					<Box className="h-full" p="3">
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
									<DropdownMenu.Item shortcut="⌘ i" onClick={() => toggleImportingFromYouTube(true)}>
										YouTube
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Flex>
					</Box>

					<hr className="border-t border-gray-300 mt-auto" />
					<Flex width="100%" direction="row" gap="3" align="center" justify={collapseSidebar ? "center" : "between"} p="3">
						<Tooltip content="Settings">
							<IconButton variant="ghost" size="2" onClick={() => navigate({ to: "/settings" })}>
								<Gear size={18} />
							</IconButton>
						</Tooltip>

						<Show when={import.meta.env.DEV && !collapseSidebar}>
							<Tooltip content="Dev area">
								<IconButton variant="ghost" onClick={() => navigate({ to: "/preview" })}>
									<Code size={18} />
								</IconButton>
							</Tooltip>
						</Show>
					</Flex>
				</Flex>
			</Box>
		</Box>
	);
}

export default memo(Sidebar);
