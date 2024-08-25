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

enum Meta {
    case playlist(PlaylistMetadata)
    case video(VideoMetadata)
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
                    
                print("Video: \(videoMeta.title)") // TODO: remove
            case .playlist:
                let playlistMeta = try Core.shared.getPlaylistMeta(url: url)
                DispatchQueue.main.async { self.meta = .playlist(playlistMeta) }
                    
                print("Playlist: \(playlistMeta.title)") // TODO: remove
            case .none:
                throw CoreError.presentable("Unable to infer link type")
            }
            
            DispatchQueue.main.async {
                withAnimation { self.isLoadingMeta = false }
            }
        } catch let CoreError.presentable(err) {
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
