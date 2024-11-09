import { invoke } from "@tauri-apps/api/core";
import { VideoDetails } from "./types";

export async function getVideoInfo(id: string): Promise<VideoDetails> {
	return await invoke("get_video_info", { id });
}
