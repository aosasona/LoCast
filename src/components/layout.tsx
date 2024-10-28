import { Window } from "@tauri-apps/api/window";
import type { PropsWithChildren } from "react";
import { Fragment, useEffect, useState } from "react";
import {
	Box,
	Button,
	DropdownMenu,
	Flex,
	IconButton,
	Tooltip,
} from "@radix-ui/themes";

import {
	CaretRight,
	CaretLeft,
	SidebarSimple,
	Plus,
} from "@phosphor-icons/react";

import { useRouter } from "@tanstack/react-router";
import YTImportModal from "./yt-import";
import Show from "./show";
import { useHotkeys } from "react-hotkeys-hook";

type Props = PropsWithChildren<{}>;

const appWindow = Window.getCurrent();

// TODO: make this toggle-able for mobile
export default function Layout({ children }: Props) {
	const router = useRouter();

	const [collapseSidebar, setCollapseSidebar] = useState(false);
	const [openYTImportModal, setOpenYtImportModal] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);

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

	// Handle window resize
	useEffect(() => {
		const unlisten = (async () => {
			const unlisten = await appWindow.onResized(async (_) => {
				const isMaximized = await appWindow.isMaximized();
				setIsMaximized(isMaximized);
			});

			return unlisten;
		})().then((unlisten) => unlisten);

		return () => {
			unlisten.then((unlisten) => unlisten());
		};
	}, []);

	useHotkeys(["ctrl+s", "meta+s"], () => setCollapseSidebar(!collapseSidebar));
	useHotkeys(["meta+i", "ctrl+i"], () => setOpenYtImportModal(true));
	useHotkeys(["meta+ArrowLeft", "ctrl+ArrowLeft"], goBack);
	useHotkeys(["meta+ArrowRight", "ctrl+ArrowRight"], goForward);

	function goBack() {
		router.history.back();
	}

	function goForward() {
		router.history.forward();
	}

	return (
		// TODO: add mobile layout
		<Fragment>
			<div
				className="w-screen h-8 fixed top-0 left-0 right-0 z-[999999999]"
				data-tauri-drag-region
			/>

			<Flex overflow="hidden">
				<Flex
					direction="column"
					width={collapseSidebar ? "60px" : "240px"}
					px="2"
					py="3"
					pt={{ md: isMaximized ? "2" : "6" }}
					className="border-r border-r-gray h-screen transition-all"
				>
					<Flex
						direction="column"
						gap="4"
						align={collapseSidebar ? "center" : "start"}
						justify="center"
						px="2"
					>
						<Flex
							align="center"
							justify={collapseSidebar ? "center" : "between"}
							gap="1"
							width="100%"
							mb="2"
						>
							<Tooltip
								content={`${collapseSidebar ? "Expand" : "Collapse"} sidebar ⌘ s`}
							>
								<IconButton
									variant="ghost"
									size="2"
									onClick={() => setCollapseSidebar(!collapseSidebar)}
								>
									<SidebarSimple size={20} />
								</IconButton>
							</Tooltip>

							<Flex
								gap="2"
								display={collapseSidebar ? "none" : "flex"}
								hidden={collapseSidebar}
								className="transition-all"
							>
								<Tooltip content="Go back ⌘ ←">
									<IconButton size="1" variant="surface" onClick={goBack}>
										<CaretLeft size={12} />
									</IconButton>
								</Tooltip>
								<Tooltip content="Go forward ⌘ →">
									<IconButton size="1" variant="surface" onClick={goForward}>
										<CaretRight size={12} />
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
								<DropdownMenu.Item
									shortcut="⌘ i"
									onClick={() => setOpenYtImportModal(true)}
								>
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
			<YTImportModal
				open={openYTImportModal}
				onClose={() => setOpenYtImportModal(false)}
				onOpen={() => setOpenYtImportModal(true)}
			/>
		</Fragment>
	);
}
