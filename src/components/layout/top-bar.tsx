import lightLogo from "@images/light-logo.svg";
import darkLogo from "@images/dark-logo.svg";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { toggleImportingFromYouTube } from "$/lib/stores/import";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";

export default function TopBar() {
	return (
		<Box display={{ sm: "none" }} position="fixed" top="0" right="0" left="0" className="pt-safe-top bar-bg border-b border-b-gray z-[999999]">
			<Flex align="center" justify="between" px="4" py="3">
				<Box>
					<img src={lightLogo} alt="Logo" className="h-9 hidden dark:block" />
					<img src={darkLogo} alt="Logo" className="h-9 block dark:hidden" />
				</Box>

				<Flex gap="6">
					<Box display={{ sm: "none" }}>
						<IconButton onClick={() => toggleImportingFromYouTube(true)} variant="ghost" color="gray" radius="full">
							<Plus size={20} />
						</IconButton>
					</Box>

					<IconButton variant="ghost" color="gray" radius="full">
						<MagnifyingGlass size={20} />
					</IconButton>
				</Flex>
			</Flex>
		</Box>
	);
}
