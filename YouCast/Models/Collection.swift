//
//  Collection.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 28/08/2024.
//
import Foundation
import SwiftData

@Model
class Collection: Equatable {
    var id: UUID = UUID()
    var name: String = ""
    var collectionDescription: String?
    var createdAt: Date = Date.now
    var lastUpdatedAt: Date?

    @Relationship(deleteRule: .nullify, inverse: \Entry.collection)
    var entries: [Entry]?

    init(name: String, entries: [Entry] = [], collectionDescription: String? = nil, createdAt: Date, lastUpdatedAt: Date? = nil) {
        self.name = name
        self.collectionDescription = collectionDescription
        self.entries = entries
        self.createdAt = createdAt
        self.lastUpdatedAt = lastUpdatedAt
    }
}
