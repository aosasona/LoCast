import type { PropsWithChildren } from "react";
import { Fragment, useState } from "react";
import lightLogo from "@images/light-logo.svg";
import darkLogo from "@images/dark-logo.svg";
import PWABadge from "$/PWABadge";
import { Box, Button, DropdownMenu, Flex, IconButton } from "@radix-ui/themes";

import { CaretRight, CaretLeft, SidebarSimple, Plus } from "@phosphor-icons/react";

import { useRouter } from "@tanstack/react-router";
import YTImportModal from "./yt-import-modal";

type Props = PropsWithChildren<{}>;

// TODO: make this toggle-able for mobile
export default function Layout({ children }: Props) {
	const router = useRouter();

	const [openYTImportModal, setOpenYtImportModal] = useState(false);

	return (
		<Fragment>
			<Flex>
				<Flex direction="column" width={{ xs: "0px", sm: "60px", lg: "min(20%, 250px)" }} px="2" py="3" className="border-r border-r-gray h-screen">
					<Flex direction="column" gap="4" align={{ sm: "center", lg: "start" }} justify="center" px="2">
						<Box className="w-max aspect-square">
							<img src={lightLogo} alt="LoCast Logo" className="w-8 aspect-square hidden dark:block" />
							<img src={darkLogo} alt="LoCast Logo" className="w-8 aspect-square dark:hidden" />
						</Box>

						<Flex align="center" justify="between" gap="1" width="100%" mb="2">
							<IconButton variant="ghost" size="2">
								<SidebarSimple size={20} />
							</IconButton>

							<Flex gap="2">
								<IconButton size="1" variant="surface" onClick={() => router.history.back()} radius="large">
									<CaretLeft size={12} />
								</IconButton>
								<IconButton size="1" variant="surface" onClick={() => router.history.forward()} radius="large">
									<CaretRight size={12} />
								</IconButton>
							</Flex>
						</Flex>

						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button className="w-full">
									Add to library
									<Plus />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Item shortcut="⌘ I" onClick={() => setOpenYtImportModal(true)}>
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

			<PWABadge />
			<YTImportModal open={openYTImportModal} onClose={() => setOpenYtImportModal(false)} onOpen={() => setOpenYtImportModal(true)} />
		</Fragment>
	);
}
