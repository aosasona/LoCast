package list

import "github.com/kkdai/youtube/v2"

// Gomobile requires this wrapper since slices of structs are not supported at the moment
type (
	PlaylistEntry struct {
		ID         string
		Title      string
		Author     string
		DurationMs int64
		Thumbnails *ThumbnailList
	}

	PlaylistEntryList struct {
		items []PlaylistEntry
	}

	PlaylistEntryIterator interface {
		Yield(entry *PlaylistEntry)
	}
)

func NewPlaylistEntryList() *PlaylistEntryList {
	return &PlaylistEntryList{items: []PlaylistEntry{}}
}

func (p *PlaylistEntryList) Add(entry PlaylistEntry) *PlaylistEntryList {
	p.items = append(p.items, entry)
	return p
}

func (p *PlaylistEntryList) From(entries []*youtube.PlaylistEntry) *PlaylistEntryList {
	for _, entry := range entries {
		p.items = append(p.items, PlaylistEntry{
			ID:         entry.ID,
			Title:      entry.Title,
			Author:     entry.Author,
			DurationMs: entry.Duration.Milliseconds(),
			Thumbnails: NewThumbnailList().From(entry.Thumbnails),
		})
	}

	return p
}

func (p *PlaylistEntryList) Get(index int) *PlaylistEntry {
	if index < 0 || index >= len(p.items) {
		return nil
	}

	return &p.items[index]
}

func (p *PlaylistEntryList) Remove(index int) *PlaylistEntryList {
	if index < 0 || index >= len(p.items) {
		return p
	}

	p.items = append(p.items[:index], p.items[index+1:]...)
	return p
}

func (p *PlaylistEntryList) Count() int { return len(p.items) }

func (p *PlaylistEntryList) Clear() *PlaylistEntryList {
	p.items = []PlaylistEntry{}
	return p
}

func (p PlaylistEntryList) Iterate(iterator PlaylistEntryIterator) {
	for _, entry := range p.items {
		iterator.Yield(&entry)
	}
}
