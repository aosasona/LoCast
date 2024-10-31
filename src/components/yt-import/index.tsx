import { Dialog } from "@radix-ui/themes";
import YouTubeSource from "$/lib/sources/youtube";
import { useState } from "react";
import ImportForm from "./form";
import Show from "../show";
import { useMutation } from "@tanstack/react-query";
import Overview from "./overview";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
	open: boolean;
	onClose: () => void;
	onOpen: () => void;
};

type Stage = "form" | "overview";

export default function YTImportModal(props: Props) {
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
		props.onClose();
	}

	return (
		<Dialog.Root open={props.open} onOpenChange={onClose}>
			<Dialog.Content maxWidth="400px">
				<Show when={stage === "form" || mutation.data == null}>
					<ImportForm open={props.open} onSubmit={(data) => mutation.mutate(data.url)} submitting={mutation.isPending} form={form} />
				</Show>

				<Show when={stage === "overview" && mutation.data != null}>
					<Overview data={mutation.data!!} prev={() => setStage("form")} />
				</Show>
			</Dialog.Content>
		</Dialog.Root>
	);
}
