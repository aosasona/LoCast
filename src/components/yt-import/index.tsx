import { Dialog } from "@radix-ui/themes";
import YouTubeSource from "$/lib/sources/youtube";
import { useState } from "react";
import ImportForm from "./form";
import Show from "../show";
import { useMutation } from "@tanstack/react-query";
import Overview from "./overview";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { importStore, toggleImportingFromYouTube } from "$/lib/stores/import";
import { useSnapshot } from "valtio";

type Stage = "form" | "overview";

export default function YTImportModal() {
	const store = useSnapshot(importStore);
	const [stage, setStage] = useState<Stage>("form");

	const form = useForm({ shouldUnregister: false });

	// TODO: support loading playlist info
	const mutation = useMutation({
		mutationFn: YouTubeSource.loadVideoInfo,
		onSuccess: (_) => setStage("overview"),
		onError: (error) => toast.error(error.message),
	});

	function onClose() {
		setStage("form");
		toggleImportingFromYouTube(false);
	}

	return (
		<Dialog.Root open={store.isImportingFromYouTube} onOpenChange={onClose}>
			<Dialog.Content maxWidth="400px">
				<Show when={stage === "form" || mutation.data == null}>
					<ImportForm onSubmit={(data) => mutation.mutate(data.url)} submitting={mutation.isPending} form={form} />
				</Show>

				<Show when={stage === "overview" && mutation.data != null}>
					<Overview data={mutation.data!!} prev={() => setStage("form")} />
				</Show>
			</Dialog.Content>
		</Dialog.Root>
	);
}
