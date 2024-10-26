import { Box, Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";

import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import YouTubeSource from "$/lib/sources/youtube";

type Props = {
	open: boolean;
	onClose: () => void;
	onOpen: () => void;
};

export default function YTImportModal(props: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useHotkeys(["meta+i", "ctrl+i"], props.onOpen);

	async function handleForm(data: Record<string, string>) {}

	return (
		<Dialog.Root open={props.open} onOpenChange={props.onClose}>
			<Dialog.Content maxWidth="450px">
				<Form.Root onSubmit={handleSubmit(handleForm)}>
					<Dialog.Title>Import from YouTube</Dialog.Title>
					<Dialog.Description>
						<Text size="2" color="gray">
							Paste in a link to a YouTube video or playlist to import it into your library.
						</Text>
					</Dialog.Description>

					<Box my="4">
						<Form.Field name="url">
							<Form.Label>
								<Text size="2" color="gray">
									Video or playlist URL
								</Text>
							</Form.Label>
							<Form.Control asChild>
								<TextField.Root
									{...register("url", {
										required: "This field is required",
										pattern: YouTubeSource.LINK_PATTERN,
									})}
									autoFocus
									size="3"
									mt="1"
									mb="2"
								/>
							</Form.Control>
							{errors.url ? <Form.Message>{errors?.url?.message?.toString()}</Form.Message> : null}
						</Form.Field>
					</Box>

					<Flex gap="2" align="center" justify="end">
						<Dialog.Close>
							<Button type="button" variant="soft" color="gray">
								Cancel
							</Button>
						</Dialog.Close>
						<Button type="submit" form="yt-import-form">
							Continue
						</Button>
					</Flex>
				</Form.Root>
			</Dialog.Content>
		</Dialog.Root>
	);
}
