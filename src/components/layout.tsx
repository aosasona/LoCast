import type { PropsWithChildren } from "react";
import { Fragment, useEffect, useState } from "react";
import { Box, Button, DropdownMenu, Flex, IconButton } from "@radix-ui/themes";

import { CaretRight, CaretLeft, SidebarSimple, Plus } from "@phosphor-icons/react";

import { useRouter } from "@tanstack/react-router";
import YTImportModal from "./yt-import-modal";
import Show from "./show";
import { useHotkeys } from "react-hotkeys-hook";

type Props = PropsWithChildren<{}>;

// TODO: make this toggle-able for mobile
export default function Layout({ children }: Props) {
	const router = useRouter();

	const [collapseSidebar, setCollapseSidebar] = useState(false);
	const [openYTImportModal, setOpenYtImportModal] = useState(false);

	useHotkeys(["ctrl+s", "meta+s"], () => setCollapseSidebar(!collapseSidebar));

	// Disable right-click context menu and selection
	useEffect(() => {
		document.addEventListener("contextmenu", (e) => e.preventDefault(), {
			capture: true,
		});

		document.addEventListener("selectstart", (e) => e.preventDefault(), {
			capture: true,
		});

		return () => {
			document.removeEventListener("contextmenu", (e) => e.preventDefault(), {
				capture: true,
			});

			document.removeEventListener("selectstart", (e) => e.preventDefault(), {
				capture: true,
			});
		};
	}, []);

	return (
		// TODO: add mobile layout
		<Fragment>
			<Flex>
				<Flex direction="column" width={collapseSidebar ? "60px" : "240px"} px="2" py="3" className="border-r border-r-gray h-screen transition-all">
					<Flex direction="column" gap="4" align={collapseSidebar ? "center" : "start"} justify="center" px="2">
						<Flex align="center" justify={collapseSidebar ? "center" : "between"} gap="1" width="100%" mb="2">
							<IconButton variant="ghost" size="2" onClick={() => setCollapseSidebar(!collapseSidebar)} title="⌘ s">
								<SidebarSimple size={20} />
							</IconButton>

							<Flex gap="2" display={collapseSidebar ? "none" : "flex"} hidden={collapseSidebar} className="transition-all">
								<IconButton size="1" variant="surface" onClick={() => router.history.back()} radius="large">
									<CaretLeft size={12} />
								</IconButton>
								<IconButton size="1" variant="surface" onClick={() => router.history.forward()} radius="large">
									<CaretRight size={12} />
								</IconButton>
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
								<DropdownMenu.Item shortcut="⌘ i" onClick={() => setOpenYtImportModal(true)}>
									YouTube
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Flex>
				</Flex>

				<Box overflowY="auto" height="100dvh" maxHeight="100dvh">
					{children}
				</Box>
			</Flex>

			<YTImportModal open={openYTImportModal} onClose={() => setOpenYtImportModal(false)} onOpen={() => setOpenYtImportModal(true)} />
		</Fragment>
	);
}
