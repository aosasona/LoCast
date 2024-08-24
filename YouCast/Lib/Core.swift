//  Core.swift
//  YouCast
import Foundation
import Shared

typealias GoCore = Shared.CoreCore

class Core {
    static let shared: Core = .init()

    private let _core: GoCore

    init() {
        guard let core = CoreNew() else {
            fatalError("Could not create shared core")
        }
        
        self._core = core
    }

    func extractVideoID(from rawURL: String) throws -> String {
        return try! unwrapCoreError { self._core.extractVideoID(rawURL, error: $0) }
    }
}
