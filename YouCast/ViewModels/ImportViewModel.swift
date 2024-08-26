//
//  ImportViewModel.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//
import Foundation
import SwiftUI

enum LinkType {
    case video
    case playlist
    case none
}

struct LinkInfo {
    let title: String?
    let author: String?
    let description: String?
    let thumbnail: Thumbnail?
}

enum Meta {
    case playlist(PlaylistMetadata)
    case video(VideoMetadata)
    
    func info() -> LinkInfo {
        var title: String?
        var author: String?
        var description: String?
        var thumbnail: Thumbnail?
        
        if case .playlist(let playlist) = self {
            title = playlist.title
            author = playlist.author
            description = playlist.description
            thumbnail = playlist.getFirstNonEmptyThumbnail()
        } else if case .video(let video) = self {
            title = video.title
            author = video.author
            description = video.description
            thumbnail = video.thumbnails?.getHighestResolution()
        }
        
        return .init(title: title, author: author, description: description, thumbnail: thumbnail)
    }
    
    var title: String? {
        switch self {
        case .playlist(let playlist): return playlist.title
        case .video(let video): return video.title
        }
    }
    
    var author: String? {
        switch self {
        case .playlist(let playlist): return playlist.author
        case .video(let video): return video.author
        }
    }
}

class ImportViewModel: ObservableObject {
    @Published var videoURL: URL? = nil
    @Published var error: String? = nil
    
    @Published var meta: Meta? = nil
    
    @Published var isLoadingMeta: Bool = false

    var canContinue: Bool { return videoURL != nil && !videoURL!.absoluteString.isEmpty }
    
    var videoURLString: Binding<String> {
        return Binding(
            get: { self.videoURL?.absoluteString ?? "" },
            set: { self.videoURL = URL(string: $0) }
        )
    }
    
    func setURL(_ url: URL) {
        videoURL = url
    }
    
    func importFromURL() {
//        do {
//            guard let url = videoURL else { return }
//            guard let id = try getResourceID() else { throw CoreError.raw("Unable to extract a resource ID, please check the URL") }
//        } catch let CoreError.raw(err) {
//            setError(err)
//            return
//        } catch {
//            setError("Failed to extract video ID, something went wrong, please try again")
//            return
//        }
    }
    
    func loadMetadata() {
        do {
            guard let url = videoURL else { return }
            let linkType = inferLinkType()
            
            DispatchQueue.main.async {
                withAnimation { self.isLoadingMeta = true }
            }
            
            switch linkType {
            case .video:
                let videoMeta = try Core.shared.getVideoMeta(url: url)
                DispatchQueue.main.async { self.meta = .video(videoMeta) }
//                let thumbnail = videoMeta.thumbnails?.getHighestResolution()
//                print("""
//                Title:          \(videoMeta.title)
//                Channel ID:     \(videoMeta.channelID)
//                Channel handle: \(videoMeta.channelHandle)
//                Author:         \(videoMeta.author)
//                Views:          \(videoMeta.views)
//
//                ------------ Thumbnail -------------
//                Width:          \(thumbnail?.width ?? 0)
//                Height:         \(thumbnail?.height ?? 0)
//                Source URL:     \(thumbnail?.sourceURL ?? "")
//                """)
            case .playlist:
                let playlistMeta = try Core.shared.getPlaylistMeta(url: url)
                DispatchQueue.main.async { self.meta = .playlist(playlistMeta) }
            case .none:
                throw CoreError.presentable("Unable to infer link type")
            }
        } catch CoreError.presentable(let err) {
            setError(err)
            return
        } catch {
            setError("Failed to extract video ID, something went wrong, please try again")
            print("[loadMetadata] An error occurred: \(error.localizedDescription)")
            return
        }
        
        DispatchQueue.main.async {
            withAnimation { self.isLoadingMeta = false }
        }
    }
    
    private func getResourceID() throws -> String? {
        guard let url = videoURL else { return nil }
        let linkType = inferLinkType()
        
        let id: String? = switch linkType {
        case .video: try Core.shared.extractVideoID(from: url)
        case .playlist: Core.shared.extractPlaylistID(from: url)
        case .none: nil
        }
        
        return id
    }
    
    // Figure out what sort of link we have, most times, we have both the `v` and `list` in the query, so we need to check the presence of the list query params first
    func inferLinkType() -> LinkType {
        guard let videoURL else { return .none }
        
        if videoURL.getQueryParam("list") != nil {
            return .playlist
        } else if videoURL.getQueryParam("v") != nil {
            return .video
        } else {
            return .none
        }
    }
    
    func resetImportStates() {
        clearError()
        videoURL = nil
    }
    
    private func setError(_ error: String) { self.error = error }
    
    private func clearError() { error = nil }
}
