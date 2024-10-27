import { Innertube, UniversalCache } from "youtubei.js";

export class YouTubeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SourceError";
	}
}

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

	client: Innertube | null = null;

	private constructor() {}

	public static async new() {
		const yt = new YouTubeSource();

		const client = await Innertube.create({
			cache: new UniversalCache(false),
			generate_session_locally: true,
		});
		yt.client = client;

		return yt;
	}

	public static extractIdentifier(url: string): string {
		if (!YouTubeSource.LINK_PATTERN.test(url)) {
			throw new YouTubeError("Invalid YouTube URL");
		}

		const matches = YouTubeSource.LINK_PATTERN.exec(url);
		if (!matches) {
			throw new YouTubeError("Invalid YouTube URL");
		}

		return matches[matches.length - 1];
	}

	public async getInfo(id: string) {
		if (!this.client) {
			throw new YouTubeError("Client not initialized");
		}

		const result = await this.client.music.getInfo(id);
		return result.basic_info ?? null;
	}
}

export default YouTubeSource;
