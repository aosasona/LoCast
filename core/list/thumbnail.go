package list

import "github.com/kkdai/youtube/v2"

// Gomobile requires this wrapper since slices of structs are not supported at the moment
type (
	Thumbnail struct {
		Width     int
		Height    int
		SourceURL string
	}

	ThumbnailList struct {
		items []Thumbnail
	}

	ThumbnailIterator interface {
		Yield(*Thumbnail)
	}
)

// ThumbnailList
func NewThumbnailList() *ThumbnailList {
	return &ThumbnailList{
		items: []Thumbnail{},
	}
}

func (t *ThumbnailList) Add(thumbnail Thumbnail) *ThumbnailList {
	t.items = append(t.items, thumbnail)
	return t
}

// This is required for the Swift wrapper to work, only the pointer type for a struct will be generated
func (t *ThumbnailList) AddPtr(thumbnail *Thumbnail) *ThumbnailList {
	t.items = append(t.items, *thumbnail)
	return t
}

func (t *ThumbnailList) GetHighestResolution() *Thumbnail {
	if len(t.items) == 0 {
		return nil
	}

	highestRes := t.items[0]
	for _, thumbnail := range t.items {
		if thumbnail.Width > highestRes.Width {
			highestRes = thumbnail
		}
	}

	return &highestRes
}

func (t *ThumbnailList) Get(index int) *Thumbnail {
	if index < 0 || index >= len(t.items) {
		return nil
	}

	return &t.items[index]
}

func (t *ThumbnailList) First() *Thumbnail {
	if len(t.items) == 0 {
		return nil
	}

	return &t.items[0]
}

func (t *ThumbnailList) Last() *Thumbnail {
	if len(t.items) == 0 {
		return nil
	}

	return &t.items[len(t.items)-1]
}

func (t *ThumbnailList) From(thumbnails []youtube.Thumbnail) *ThumbnailList {
	for _, thumbnail := range thumbnails {
		t.items = append(t.items, Thumbnail{
			Width:     int(thumbnail.Width),
			Height:    int(thumbnail.Height),
			SourceURL: thumbnail.URL,
		})
	}
	return t
}

func (t *ThumbnailList) Remove(index int) *ThumbnailList {
	if index < 0 || index >= len(t.items) {
		return t
	}

	t.items = append(t.items[:index], t.items[index+1:]...)
	return t
}

func (t *ThumbnailList) Count() int { return len(t.items) }

func (t *ThumbnailList) Clear() *ThumbnailList {
	t.items = []Thumbnail{}
	return t
}

func (t ThumbnailList) Iterate(iterator ThumbnailIterator) {
	for _, thumbnail := range t.items {
		iterator.Yield(&thumbnail)
	}
}
