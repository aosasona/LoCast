import React from "react";

import { Box } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Window } from "@tauri-apps/api/window";

const appWindow = Window.getCurrent();

function Header() {
	const [isMaximized, setIsMaximized] = useState(false);

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

	return <Box display={{ initial: "none", sm: "block" }} width="100%" height={isMaximized ? "0px" : "20px"} data-tauri-drag-region />;
}

export default React.memo(Header);
