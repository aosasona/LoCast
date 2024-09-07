//
//  ImportViewModel.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//
import Foundation
import SwiftData
import SwiftUI

let mobileYoutubeLinkRegex = /^(http(s):\/\/)?(youtu\.be\/[a-zA-Z0-9_-]{10,})(.*)$/

enum LinkType {
    case video
    case playlist
    case none
}

struct LinkInfo {
    let id: String
    let title: String?
    let channelId: String?
    let author: String?
    let description: String?
    let thumbnail: Thumbnail?
    let durationMS: Int64?
    let itemCount: Int?
    let isPlaylist: Bool
}

enum Meta {
    case playlist(PlaylistMetadata)
    case video(VideoMetadata)
    
    func info() -> LinkInfo {
        var title: String?
        var author: String?
        var description: String?
        var thumbnail: Thumbnail?
        var channelId: String?
        var durationMS: Int64?
        var itemCount: Int?
        var isPlaylist = false
        
        if case .playlist(let playlist) = self {
            title = playlist.title
            author = playlist.author
            description = playlist.description
            thumbnail = playlist.getFirstNonEmptyThumbnail()
            durationMS = playlist.getTotalDurationMs()
            itemCount = playlist.getVideoCount()
            isPlaylist = true
        } else if case .video(let video) = self {
            title = video.title
            author = video.author
            description = video.description
            thumbnail = video.thumbnails?.getHighestResolution()
            channelId = video.channelID
            durationMS = video.durationMs
        }
        
        let id = switch self {
        case .playlist(let p): p.id_
        case .video(let v): v.id_
        }
        
        return .init(
            id: id,
            title: title,
            channelId: channelId,
            author: author,
            description: description,
            thumbnail: thumbnail,
            durationMS: durationMS,
            itemCount: itemCount,
            isPlaylist: isPlaylist
        )
    }
}

class ImportViewModel: ObservableObject {
    @Published var videoURL: URL? = nil
    @Published var info: LinkInfo? = nil

    @Published var error: String? = nil
    var hasError: Binding<Bool> {
        return .init(
            get: { self.error != nil },
            set: { _ in }
        )
    }
    
    @Published var showPreview: Bool = false
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
    
    func addVideoToLibrary(db: Database) -> Entry? {
        guard let info else { return nil }
        
        var thumbnailURL: URL? = nil
        if let sourceURLString = info.thumbnail?.sourceURL {
            thumbnailURL = URL(string: sourceURLString)
        }
        
        let id: String = info.id
        let exists = db.exists(predicate: #Predicate<Entry> { $0.videoId == id })
        switch exists {
        case .success(let exists):
            if exists {
                setError("Video already exists in library")
                return nil
            }
        case .failure(let err):
            setError("Failed to check if video already exists in library, see logs for details")
            Logger.shared.error("Failed to check if video exists: Error=\(err)")
            return nil
        }
        
        let entry = Entry(
            videoId: info.id,
            title: info.title ?? "Unknown",
            entryDescription: info.description ?? "",
            duration: TimeInterval(info.durationMS ?? 0),
            channelId: info.channelId,
            thumbnailUrl: thumbnailURL
        )
        
        // TODO: check if video already exists
        if case .failure(let err) = db.insert(entry) {
            Logger.shared.error("Failed to add video to library: ID=\(entry.videoId), Error=\(err)")
            setError("Failed to add video to library, see logs for details")
            return nil
        }
        
        return entry
    }
    
    func loadMetadata() {
        do {
            guard let url = videoURL else { return }
            let linkType = inferLinkType()
            
            DispatchQueue.main.async {
                withAnimation { self.isLoadingMeta = true }
            }
            
            defer {
                DispatchQueue.main.async {
                    withAnimation { self.isLoadingMeta = false }
                }
            }

            let meta: Meta
            switch linkType {
            case .video:
                let videoMeta = try Core.shared.getVideoMeta(url: url)
                meta = .video(videoMeta)
            case .playlist:
                let playlistMeta = try Core.shared.getPlaylistMeta(url: url)
                meta = .playlist(playlistMeta)
            case .none:
                throw CoreError.presentable("Unable to infer link type")
            }
            
            DispatchQueue.main.async {
                self.info = meta.info()
                self.showPreview = true
            }
            
        } catch CoreError.presentable(let err) {
            Logger.shared.error("Failed to load metadata: \(err)")
            setError(err)
            return
        } catch {
            setError("Failed to load metadata, something went wrong, please try again")
            Logger.shared.error("Failed to load metadata: \(error)")
            return
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
        
        if videoURL.absoluteString.contains(mobileYoutubeLinkRegex) {
            return .video
        }

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
        showPreview = false
        info = nil
    }
    
    func setError(_ error: String) {
        DispatchQueue.main.async { self.error = error }
    }

    func clearError() {
        DispatchQueue.main.async { self.error = nil }
    }
}
