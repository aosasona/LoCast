import { ThemePanel } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/preview")({
	component: import.meta.env.DEV ? ThemePanel : () => null,
});
