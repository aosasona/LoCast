package core

import "github.com/kkdai/youtube/v2"

type Core struct {
	youtubeClient *youtube.Client
}

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
