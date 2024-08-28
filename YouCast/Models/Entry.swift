//
//  Entry.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 28/08/2024.
//
import Foundation
import SwiftData

enum ProcessingState: String, Codable {
    case queued
    case processing
    case processed
    case failed
    case cancelled // should not be processed without user action
}

enum FailureReason: String, Codable {
    case invalidResource
    case unknown
    case tooManyRequests
}

struct Failure: Codable {
    var reason: FailureReason
    var message: String
    var count: Int
}

@Model
class Entry {
    var id: UUID = UUID()
    var videoId: String = ""
    @Attribute(.spotlight) var title: String = ""
    var fileName: String = "" // Name of the downloaded audio file
    var entryDescription: String = ""
    var duration: TimeInterval = 0
    var channelId: String = ""
    var thumbnailUrl: URL?
    var processingState: ProcessingState = ProcessingState.queued
    var failure: Failure?
    var createdAt: Date = Date.now
    var lastModifiedAt: Date?
    var collection: Collection?

    init(videoId: String, title: String, fileName: String, entryDescription: String, duration: TimeInterval, channelId: String, thumbnailUrl: URL? = nil) {
        self.videoId = videoId
        self.title = title
        self.fileName = fileName
        self.entryDescription = entryDescription
        self.duration = duration
        self.channelId = channelId
        self.thumbnailUrl = thumbnailUrl
        self.createdAt = .now
    }
}
