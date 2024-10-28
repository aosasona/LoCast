import { commands, VideoDetails } from "../bindings";
import { presentError, YouTubeError } from "../error";

// TODO: create a generic source class that all sources will extend in the future
class YouTubeSource {
	/**
	 * Examples
	 * - https://www.youtube.com/watch?v=s_nc1IVoLxc
	 * - https://youtu.be/jpMpyDmNnW0?si=YnuDCcuVEG6xWBnz
	 * - https://www.youtube.com/playlist?list=PLFw63EhDrnOe4Cn8mpNifIpNbMoBY_ljE
	 * - https://music.youtube.com/watch?si=wd7-j8qYJ7_6ZvuL&v=bPQsOKwo_k8
	 *
	 * NOTE: This pattern is not perfect, but it's good enough for now, perhaps we should do proper parsing in the future if needed
	 **/
	public static LINK_PATTERN =
		/^(http(s)?:\/\/)?((((www|m|music)\.)?youtube\.com\/(watch\?(.*?)v=([a-zA-Z0-9_-]{10,})|playlist\?list=([a-zA-Z0-9_-]+)))|(youtu\.be\/([a-zA-Z0-9_-]{10,})))/;

	private constructor() { }

	public static new() {
		return new YouTubeSource();
	}

	public static extractIdentifier(url: string): string {
		url = url.trim();

		if (!YouTubeSource.LINK_PATTERN.test(url)) {
			throw new YouTubeError("Invalid YouTube URL");
		}

		const matches = YouTubeSource.LINK_PATTERN.exec(url);
		if (matches == null || !matches.length) {
			throw new YouTubeError("Invalid YouTube URL");
		}

		// Remove empty matches
		const filteredMatches = matches.filter((match) => match !== undefined && match !== null && match !== "");

		const id = String(filteredMatches[filteredMatches.length - 1]);
		if (!id) {
			throw new YouTubeError("Invalid YouTube URL");
		}

		console.trace(`[YouTubeSource] extractIdentifier`, id);
		return id;
	}

	public static async loadVideoInfo(url: string): Promise<VideoDetails | null> {
		try {
			const id = YouTubeSource.extractIdentifier(url);
			const result = await commands.getVideoInfo(id);
			console.trace(`[YTImportModal] loadVideoInfo`, result);

			if (result.status == "error") throw new YouTubeError(result.error);
			if (!result.data) throw new YouTubeError("No data returned");

			return result.data;
		} catch (error) {
			presentError(error);
			return null;
		}
	}
}

export default YouTubeSource;
