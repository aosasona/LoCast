package core

import "go.trulyao.dev/youcast/list"

type (
	VideoMeta struct {
		ID              string
		Title           string
		Description     string
		Author          string
		ChannelID       string
		ChannelHandle   string
		Views           int
		DurationMs      int64
		UnixPublishDate int64

		Formats    *list.FormatList
		Thumbnails *list.ThumbnailList
	}

	PlaylistMeta struct {
		ID          string
		Title       string
		Description string
		Author      string
		Videos      *list.PlaylistEntryList
	}
)

// GetHighestResolution returns the first non-empty thumbnail with the highest resolution
func (p *PlaylistMeta) GetFirstNonEmptyThumbnail() *list.Thumbnail {
	if p.Videos == nil {
		return nil
	}

	// Attempt to get the thumbnail from the first video
	thumbnail := p.Videos.Get(0).Thumbnails.GetHighestResolution()
	if thumbnail != nil {
		return thumbnail
	}

	// If the first video has no thumbnail, iterate through the rest of the videos to find one
	for idx := range p.Videos.Count() {
		thumbnail = p.Videos.Get(idx).Thumbnails.GetHighestResolution()
		if thumbnail != nil {
			break
		}

		break
	}

	return thumbnail
}

func (p *PlaylistMeta) GetTotalDurationMs() int64 {
	if p.Videos == nil {
		return 0
	}

	var totalDuration int64
	for idx := range p.Videos.Count() {
		totalDuration += p.Videos.Get(idx).DurationMs
	}

	return totalDuration
}

func (c *Core) GetVideoMeta(url string) (*VideoMeta, error) {
	video, err := c.youtubeClient.GetVideo(url)
	if err != nil {
		return nil, err
	}

	formats := list.NewFormatList().From(video.Formats)
	thumbnails := list.NewThumbnailList().From(video.Thumbnails)

	meta := VideoMeta{
		ID:              video.ID,
		Title:           video.Title,
		Description:     video.Description,
		Author:          video.Author,
		ChannelID:       video.ChannelID,
		ChannelHandle:   video.ChannelHandle,
		Views:           video.Views,
		DurationMs:      video.Duration.Milliseconds(),
		UnixPublishDate: (video.PublishDate.Unix()),
		Formats:         formats,
		Thumbnails:      thumbnails,
	}

	return &meta, nil
}

func (c *Core) GetPlaylistMeta(url string) (*PlaylistMeta, error) {
	playlist, err := c.youtubeClient.GetPlaylist(url)
	if err != nil {
		return nil, err
	}

	playListEntries := list.NewPlaylistEntryList().From(playlist.Videos)

	meta := PlaylistMeta{
		ID:          playlist.ID,
		Title:       playlist.Title,
		Description: playlist.Description,
		Author:      playlist.Author,
		Videos:      playListEntries,
	}

	return &meta, nil
}
