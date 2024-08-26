//  Core.swift
//  YouCast
import Foundation
import Shared

typealias GoCore = Shared.CoreCore
typealias VideoMetadata = Shared.CoreVideoMeta
typealias PlaylistMetadata = Shared.CorePlaylistMeta

typealias ThumbnailList = ListThumbnailList
typealias Thumbnail = ListThumbnail

class Core {
    static let shared: Core = .init()

    private let _core: GoCore

    init() {
        guard let core = CoreNew() else {
            fatalError("Could not create shared core")
        }

        self._core = core
    }

    func extractVideoID(from url: URL) throws -> String? {
        // This will _ideally_ never be empty as long as there is no error but, checking regardless won't hurt
        let result = try! unwrapCoreError { self._core.extractVideoID(url.absoluteString, error: $0) }
        if result.isEmpty {
            return nil
        }

        return result
    }

    func extractPlaylistID(from url: URL) -> String? {
        guard let playlistID = url.getQueryParam("list") else {
            return nil
        }

        // Redundant, yes, but cautionary
        if playlistID.isEmpty {
            return nil
        }

        return playlistID
    }

    func getVideoMeta(url: URL) throws -> VideoMetadata {
        do {
            let result = try self._core.getVideoMeta(url.absoluteString)
            return result
        } catch {
            throw CoreError.raw(error)
        }
    }
    
    func getPlaylistMeta(url: URL) throws -> PlaylistMetadata {
        do {
            let result = try self._core.getPlaylistMeta(url.absoluteString)
            return result
        } catch {
            throw CoreError.raw(error)
        }
    }
}
