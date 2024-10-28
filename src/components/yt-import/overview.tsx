import { VideoDetails } from "$/lib/bindings";
import { CaretLeft, Plus } from "@phosphor-icons/react";
import { Badge, Box, Button, Dialog, Flex, Link, Text } from "@radix-ui/themes";
import { toast } from "sonner";

type Props = {
	data: VideoDetails;
	prev: () => void;
};

function formatDuration(duration: number) {
	const hours = Math.floor(duration / 3600);
	const minutes = Math.floor((duration % 3600) / 60);
	const seconds = duration % 60;

	const parts = [hours, minutes, seconds].map((part) => part.toString().padStart(2, "0"));

	return parts.join(":");
}

// TODO: squash these into the same modal content box
export default function Overview({ data, ...props }: Props) {
	return (
		<Flex direction="column" gap="5">
			<Flex direction="column" align="start" gap="4">
				<Box width="auto" className="aspect-video object-cover">
					<img src={data.thumbnails?.standard.url} alt={data.title} className="w-full h-full object-cover" />
				</Box>

				<Flex direction="column" gap="2" className="max-w-full">
					<Dialog.Title className="m-0">{data.title}</Dialog.Title>
					<Flex gap="2" align="center">
						{data.author ? (
							<Link href={data.author.url} target="_blank" rel="noopener noreferrer">
								<Text size="2">{data.author?.name}</Text>
							</Link>
						) : null}

						{data.duration_in_seconds && <Badge color="orange">{formatDuration(parseInt(data.duration_in_seconds))}</Badge>}
						{data.view_count && <Badge color="crimson">{parseInt(data.view_count).toLocaleString()} views</Badge>}
						{data.publish_date && (
							<Badge color="blue">
								{new Date(data.publish_date).toLocaleDateString(undefined, {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</Badge>
						)}
					</Flex>
				</Flex>
			</Flex>

			<Flex align="center" justify="between">
				<Button color="gray" variant="ghost" onClick={props.prev}>
					<CaretLeft /> Back
				</Button>

				<Flex gap="2" align="center" justify="end">
					<Dialog.Close>
						<Button type="button" variant="soft" color="gray">
							Cancel
						</Button>
					</Dialog.Close>
					<Button type="button" onClick={() => toast.info("TODO")}>
						<Plus /> Import
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
}
