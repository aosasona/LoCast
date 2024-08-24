//
//  HomeViewModel.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//
import SwiftUI

enum LinkType {
    case video
    case playlist
    case none
}

class HomeViewModel: ObservableObject {
    @Published var videoURL: URL? = nil
    @Published var error: String? = nil
    @Published var importType: LinkType = .none
    
    @Published var showImportSheet: Bool = false
    @Published var showSettingsSheet: Bool = false

    var videoURLString: Binding<String> {
        return Binding(
            get: { self.videoURL?.absoluteString ?? "" },
            set: { self.videoURL = URL(string: $0) }
        )
    }
    
    var canImportURL: Bool { return videoURL != nil && !videoURL!.absoluteString.isEmpty }
    
    func importFromURL() {
        do {
            guard let url = videoURL else { return }
            let videoID = try Core.shared.extractVideoID(from: url.absoluteString)
            print(videoID)
        } catch let CoreError.raw(err) {
            setError(err)
        } catch {
            setError("Failed to extract video ID, something went wrong, please try again")
        }
    }
    
    // Figure out what sort of link we have, most times, we have both the `v` and `list` in the query, so we need to check the presence of the list query params first
    func inferImportType() -> LinkType {
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
