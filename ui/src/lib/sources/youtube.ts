// TODO: create a generic source class that all sources will extend in the future
//
class YouTubeSource {
	// Examples
	// - https://www.youtube.com/watch?v=s_nc1IVoLxc
	// - https://youtu.be/jpMpyDmNnW0?si=YnuDCcuVEG6xWBnz
	// - https://www.youtube.com/playlist?list=PLFw63EhDrnOe4Cn8mpNifIpNbMoBY_ljE
	// NOTE: This pattern is not perfect, but it's good enough for now, perhaps we should do proper parsing in the future if needed
	public static LINK_PATTERN = /^(http(s)?:\/\/)?((((www|m)\.)?youtube\.com\/(watch\?v=([a-zA-Z0-9_-]{10,})|playlist\?list=([a-zA-Z0-9_-]+)))|(youtu\.be\/([a-zA-Z0-9_-]{10,})))/;

	public extractIdentifier(url: string): string | null {
		if (!YouTubeSource.LINK_PATTERN.test(url)) {
			return null;
		}

		const matches = YouTubeSource.LINK_PATTERN.exec(url);
		if (!matches) {
			return null;
		}

		return matches[matches.length - 1];
	}
}

export default YouTubeSource;
