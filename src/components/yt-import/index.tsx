import { Dialog } from "@radix-ui/themes";
import YouTubeSource from "$/lib/sources/youtube";
import { useEffect, useState } from "react";
import ImportForm from "./form";
import Show from "../show";
import { useMutation } from "@tanstack/react-query";
import Overview from "./overview";
import { useForm } from "react-hook-form";

type Props = {
	open: boolean;
	onClose: () => void;
	onOpen: () => void;
};

type Stage = "form" | "overview";

export default function YTImportModal(props: Props) {
	const [stage, setStage] = useState<Stage>("form");
	const [url, setUrl] = useState<string | undefined>(undefined);

	const form = useForm({ shouldUnregister: false });

	useEffect(() => {
		if (stage === "form") {
			form.setValue("url", url);
		}
	}, [stage]);

	// TODO: support loading playlist info
	const mutation = useMutation({
		mutationFn: async (url: string) => {
			setUrl(url);
			const info = await YouTubeSource.loadVideoInfo(url);
			if (!!info) {
				setStage("overview");
			}

			return info;
		},
	});

	function onClose() {
		setStage("form");
		setUrl(undefined);
		props.onClose();
	}

	return (
		<Dialog.Root open={props.open} onOpenChange={onClose}>
			<Dialog.Content maxWidth="450px">
				<Show when={stage === "form" || mutation.data == null}>
					<ImportForm open={props.open} onSubmit={(data) => mutation.mutate(data.url)} submitting={mutation.isPending} form={form} defaultUrl={url} />
				</Show>

				<Show when={stage === "overview" && mutation.data != null}>
					<Overview data={mutation.data!!} prev={() => setStage("form")} />
				</Show>
			</Dialog.Content>
		</Dialog.Root>
	);
}
