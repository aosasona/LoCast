import { VideoDetails } from "$/lib/bindings";
import YouTubeSource from "$/lib/sources/youtube";
import { ArrowClockwise, CaretLeft, Plus } from "@phosphor-icons/react";
import { Badge, Box, Button, Dialog, Flex, Heading, IconButton, Link, Spinner, Text, TextField, Tooltip } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const DESCRIPTION_LIMIT = 200;

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
export default function Overview(props: Props) {
	const [url, setUrl] = useState("");
	const [data, setData] = useState<VideoDetails>(props.data);

	const mutation = useMutation({
		mutationFn: YouTubeSource.loadVideoInfo,
		onSuccess: (data) => setData(data),
		onError: (error) => toast.error(error.message),
	});

	return (
		<Flex direction="column" gap="5">
			<Flex direction="column" align="start" gap="4">
				<Flex gap="3" align="center" width="100%">
					<Box width="100%">
						<TextField.Root value={data.url} variant="surface" onChange={(e) => setUrl(e.target.value)} />
					</Box>

					<Tooltip content="Reload video info">
						<IconButton variant="ghost" onClick={() => mutation.mutate(url)} disabled={url == props.data.url || url.trim().length == 0}>
							<ArrowClockwise className={mutation.isPending ? "animate-spin" : ""} />
						</IconButton>
					</Tooltip>
				</Flex>

				<Box width="auto" className="aspect-video object-cover border border-gray-600 rounded-md overflow-hidden">
					<img src={data.thumbnails?.standard.url} alt={data.title} className="w-full h-full object-cover" />
				</Box>

				<Flex direction="column" gap="2" className="max-w-full transition-all">
					<Heading className="m-0">{data.title}</Heading>
					<Flex gap="2" align="center" wrap="wrap">
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

					<Text size="2" color="gray">
						{data.description.length > DESCRIPTION_LIMIT ? `${data.description.slice(0, DESCRIPTION_LIMIT)?.trim()}...` : data.description}
					</Text>
				</Flex>
			</Flex>

			<Flex gap="2" align="center" justify="end">
				<Dialog.Close>
					<Button type="button" variant="soft" color="gray">
						Cancel
					</Button>
				</Dialog.Close>
				<Button type="button" onClick={() => toast.info("TODO")} disabled={mutation.isPending}>
					<Plus /> Import
				</Button>
			</Flex>
		</Flex>
	);
}
