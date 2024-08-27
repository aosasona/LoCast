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

struct LinkMeta {
    let rawMeta: Meta
    let info: LinkInfo
    var thumbnail: Thumbnail? = nil
    var resolvedThumbnailImage: UIImage? = nil
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
}

class ImportViewModel: ObservableObject {
    @Published var videoURL: URL? = nil
    @Published var linkMeta: LinkMeta? = nil

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
            
            DispatchQueue.main.async { self.linkMeta = LinkMeta(rawMeta: meta, info: meta.info()) }
            if let thumb = meta.info().thumbnail {
                DispatchQueue.main.async { self.linkMeta?.thumbnail = thumb } // Serves as a cache (sort of)
                
                DispatchQueue.global().async { [weak self] in
                    guard let data = try? Data(contentsOf: URL(string: thumb.sourceURL)!) else { return }
                    guard let image = UIImage(data: data) else { return }
                    DispatchQueue.main.async { self?.linkMeta?.resolvedThumbnailImage = image }
                }
                
                if let image = linkMeta?.resolvedThumbnailImage {
                    print("Color: \(image.averageColor ?? .clear)")
                }
            }
            
            DispatchQueue.main.async { self.showPreview = true }
            
        } catch CoreError.presentable(let err) {
            setError(err)
            return
        } catch {
            setError("Failed to extract video ID, something went wrong, please try again")
            print("[loadMetadata] An error occurred: \(error.localizedDescription)")
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
    // TODO: account for links like this: https://youtu.be/OPckpjBSAOw?si=k4GMS1RQws1f9j23
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
        linkMeta = nil
    }
    
    private func setError(_ error: String) {
        DispatchQueue.main.async { self.error = error }
    }

    func clearError() { error = nil }
}
