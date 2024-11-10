import { invoke } from "@tauri-apps/api/core";
import type { InvokeArgs } from "@tauri-apps/api/core";
import { VideoDetails } from "./types";

type Result<T> = { status: "ok"; data: T } | { status: "error"; error: string };

async function command<T>(
	name: string,
	params: InvokeArgs,
): Promise<Result<T>> {
	try {
		return { status: "ok", data: await invoke(name, params) };
	} catch (error) {
		return { status: "error", error: error as string };
	}
}

export async function getVideoInfo(id: string): Promise<Result<VideoDetails>> {
	return await command("get_video_info", { id });
}

export async function importVideo(details: VideoDetails): Promise<void> {
	await command<void>("import_video", { details });
}
