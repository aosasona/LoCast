import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { Box, Flex, ScrollArea } from "@radix-ui/themes";

import YTImportModal from "@ui/yt-import";
import { useHotkeys } from "react-hotkeys-hook";
import Sidebar from "./sidebar";
import TabBar from "./tab-bar";
import DragBar from "./drag-bar";
import { toggleImportingFromYouTube } from "$/lib/stores/import";
import TopBar from "./top-bar";

type Props = PropsWithChildren<{}>;

export default function Layout({ children }: Props) {
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

	useHotkeys(["meta+i", "ctrl+i"], () => toggleImportingFromYouTube(true));

	return (
		<Box height="100vh" width="100dvw" className="sm:bg-neutral-200/95 sm:dark:bg-neutral-900/95" >
			<Flex direction="column" height="100%" width="100%">
				<DragBar />

				<Flex direction={{ initial: "column", sm: "row" }} flexGrow="1" overflowY="hidden" width="100%" height="100%" maxHeight="100dvh">
					<Sidebar />

					<Box className="w-full h-full" p={{ sm: "3", lg: "2" }} pl="0">
						<TopBar />

						<ScrollArea scrollbars="vertical" className="md:bg-transparent sm:rounded-md" style={{ width: "100%", height: "100%" }}>
							{children}
						</ScrollArea>
					</Box>

					{/*  TODO: add player here - static on desktop, floating above nav on mobile */}

					<TabBar />
				</Flex>
				<YTImportModal />
			</Flex>
		</Box >
	);
}
