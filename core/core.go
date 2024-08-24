package core

import "github.com/kkdai/youtube/v2"

type Core struct{}

func New() *Core {
	return &Core{}
}

func ExtractVideoID(url string) (string, error) {
	videoID, err := youtube.ExtractVideoID(url)
	if err != nil {
		return "", err
	}

	return videoID, nil
}
