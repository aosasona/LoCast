import { Box, Button, Dialog, Flex, IconButton, Spinner, Text, TextField } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import YouTubeSource from "$/lib/sources/youtube";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { Clipboard } from "@phosphor-icons/react";
import { presentError } from "$/lib/error";
import { subscribe } from "valtio";
import { importStore } from "$/lib/stores/import";

type Props = {
	submitting: boolean;
	onSubmit: SubmitHandler<FieldValues>;
};
export default function ImportForm(props: Props) {
	const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ shouldUnregister: false });

	useEffect(() => {
		const unsubscribe = subscribe(importStore, () => {
			if (!importStore.isImportingFromYouTube) {
				reset();
			}
		});

		return unsubscribe;
	}, []);

	function pasteFromClipboard() {
		readText()
			.then((text) => setValue("url", text))
			.catch(presentError);
	}

	return (
		<Form.Root onSubmit={handleSubmit(props.onSubmit)}>
			<Dialog.Title>Import from YouTube</Dialog.Title>
			<Dialog.Description>
				<Text size="2" color="gray">
					Paste in a link to a YouTube video or playlist to import it into your library.
				</Text>
			</Dialog.Description>

			<Box mt="4" mb="6">
				<Form.Field name="url">
					<Form.Label>
						<Text size="2" color="gray">
							Video or playlist URL
						</Text>
					</Form.Label>
					<Form.Control asChild>
						<Flex align="center" gap="3" mt="1" mb="2">
							<Box width="100%">
								<TextField.Root
									{...register("url", {
										required: "This field is required",
										pattern: YouTubeSource.LINK_PATTERN,
									})}
									autoFocus
								/>
							</Box>
							<IconButton type="button" variant="soft" onClick={pasteFromClipboard}>
								<Clipboard size={16} />
							</IconButton>
						</Flex>
					</Form.Control>

					{errors.url ? (
						<Form.Message>
							<Text size="2" color="red">
								{errors?.url?.message?.toString()}
							</Text>
						</Form.Message>
					) : null}
				</Form.Field>
			</Box>

			<Flex gap="2" align="center" justify="end">
				<Dialog.Close>
					<Button type="button" variant="soft" color="gray">
						Cancel
					</Button>
				</Dialog.Close>
				<Button type="submit" disabled={props.submitting}>
					{props.submitting ? <Spinner /> : "Continue"}
				</Button>
			</Flex>
		</Form.Root>
	);
}
