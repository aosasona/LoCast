package core

import (
	"github.com/kkdai/youtube/v2"
	"go.trulyao.dev/youcast/list"
)

type Core struct {
	youtubeClient *youtube.Client
}

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

func New() *Core {
	return &Core{
		youtubeClient: &youtube.Client{},
	}
}

func (c *Core) ExtractVideoID(url string) (string, error) {
	videoID, err := youtube.ExtractVideoID(url)
	if err != nil {
		return "", err
	}

	return videoID, nil
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
