import type { PropsWithChildren } from "react";
import { Fragment, useEffect, useState } from "react";
import { Box, Flex, ScrollArea } from "@radix-ui/themes";

import YTImportModal from "@ui/yt-import";
import { useHotkeys } from "react-hotkeys-hook";
import Sidebar from "./sidebar";
import { TabBar } from "./tabbar";
import { Window } from "@tauri-apps/api/window";

type Props = PropsWithChildren<{}>;

const appWindow = Window.getCurrent();

export default function Layout({ children }: Props) {
	const [openYTImportModal, setOpenYtImportModal] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);

	// Disable right-click context menu and selection
	useEffect(() => {
		document.addEventListener("contextmenu", (e) => e.preventDefault(), {
			capture: true,
		});

		document.addEventListener(
			"selectstart",
			(e) => {
				// Ensure the target is not an input field
				if (e.target instanceof HTMLInputElement) return;
				e.preventDefault();
			},
			{ capture: true }
		);

		return () => {
			document.removeEventListener("contextmenu", (e) => e.preventDefault(), {
				capture: true,
			});

			document.removeEventListener(
				"selectstart",
				(e) => {
					// Ensure the target is not an input field
					if (e.target instanceof HTMLInputElement) return;
					e.preventDefault();
				},
				{ capture: true }
			);
		};
	}, []);

	// Handle window resize
	useEffect(() => {
		const unlisten = (async () => {
			const unlisten = await appWindow.onResized(async (_) => {
				const isFullscreen = await appWindow.isFullscreen();
				setIsMaximized(isFullscreen);
			});

			return unlisten;
		})().then((unlisten) => unlisten);

		return () => {
			unlisten.then((unlisten) => unlisten());
		};
	}, []);

	useHotkeys(["meta+i", "ctrl+i"], () => setOpenYtImportModal(true));

	return (
		<Flex direction="column" height="100dvh" width="100dvw">
			<Box display={{ initial: "none", sm: "block" }} width="100%" height={isMaximized ? "0px" : "20px"} data-tauri-drag-region />
			<Flex direction={{ initial: "column", sm: "row" }} overflowY="hidden" width="100%" height="100%" maxHeight="100dvh">
				<Sidebar handleOpenYtImportModal={() => setOpenYtImportModal(true)} />

				<Box className="w-full h-full" p={{ sm: "2" }} pl="0">
					<ScrollArea scrollbars="vertical" className="sm:bg-gray-100 sm:rounded-md" style={{ height: "100%" }}>
						{children}
					</ScrollArea>
				</Box>

				{/*  TODO: add player here - static on desktop, floating above nav on mobile */}

				<TabBar handleOpenYtImportModal={() => setOpenYtImportModal(true)} />
			</Flex>
			<YTImportModal open={openYTImportModal} onClose={() => setOpenYtImportModal(false)} onOpen={() => setOpenYtImportModal(true)} />
		</Flex>
	);
}
