package list

import (
	"strconv"

	"github.com/kkdai/youtube/v2"
)

// Gomobile requires this wrapper since slices of structs are not supported at the moment
type (
	Format struct {
		Itag             int
		URL              string
		MimeType         string
		Quality          string
		Bitrate          int
		FPS              int
		Width            int
		Height           int
		LastModified     string
		ContentLength    int64
		QualityLabel     string
		ProjectionType   string
		AverageBitrate   int
		AudioQuality     string
		ApproxDurationMs int64
		AudioSampleRate  string
		AudioChannels    int
	}

	FormatList struct {
		items []Format
	}

	FormatIterator interface {
		Yield(format *Format)
	}
)

// Format list
func NewFormatList() *FormatList {
	return &FormatList{items: []Format{}}
}

func (f *FormatList) Add(format Format) *FormatList {
	f.items = append(f.items, format)
	return f
}

func (f *FormatList) From(formats []youtube.Format) *FormatList {
	for _, format := range formats {
		durationMs, _ := strconv.ParseInt(format.ApproxDurationMs, 10, 64)

		f.items = append(f.items, Format{
			Itag:             format.ItagNo,
			URL:              format.URL,
			MimeType:         format.MimeType,
			Quality:          format.Quality,
			Bitrate:          format.Bitrate,
			FPS:              format.FPS,
			Width:            format.Width,
			Height:           format.Height,
			LastModified:     format.LastModified,
			ContentLength:    format.ContentLength,
			QualityLabel:     format.QualityLabel,
			ProjectionType:   format.ProjectionType,
			AverageBitrate:   format.AverageBitrate,
			AudioQuality:     format.AudioQuality,
			ApproxDurationMs: durationMs,
			AudioSampleRate:  format.AudioSampleRate,
			AudioChannels:    format.AudioChannels,
		})
	}

	return f
}

func (f *FormatList) Get(index int) *Format {
	if index < 0 || index >= len(f.items) {
		return nil
	}

	return &f.items[index]
}

func (f *FormatList) Remove(index int) *FormatList {
	if index < 0 || index >= len(f.items) {
		return f
	}

	f.items = append(f.items[:index], f.items[index+1:]...)
	return f
}

func (f *FormatList) Count() int { return len(f.items) }

func (f *FormatList) Clear() *FormatList {
	f.items = []Format{}
	return f
}

func (f FormatList) Iterate(iterator FormatIterator) {
	for _, format := range f.items {
		iterator.Yield(&format)
	}
}
