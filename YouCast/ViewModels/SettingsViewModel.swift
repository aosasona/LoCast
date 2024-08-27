//
//  SettingsViewModel.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//
import Foundation

enum SettingsKey: String, CaseIterable {
    case autoPasteFromClipboard
    case clearClipboardOnPaste
}

class SettingsViewModel: ObservableObject {
    @Published var autoPasteFromClipboard: Bool = SettingsKVStore.get(for: .autoPasteFromClipboard)
    @Published var clearClipboardOnPaste: Bool = SettingsKVStore.get(for: .clearClipboardOnPaste)
}

class SettingsKVStore {
    public static func set(_ value: Bool, for key: SettingsKey) {
        NSUbiquitousKeyValueStore.default.set(value, forKey: key.rawValue)
    }

    public static func get<T>(for key: SettingsKey) -> T {
        let getFromStore: (String) -> T

        switch T.self {
            case is String.Type:
                getFromStore = { NSUbiquitousKeyValueStore.default.string(forKey: $0) as! T }
            case is Bool.Type:
                getFromStore = { NSUbiquitousKeyValueStore.default.bool(forKey: $0) as! T }
            case is Double.Type:
                getFromStore = { NSUbiquitousKeyValueStore.default.double(forKey: $0) as! T }
            case is Int64.Type:
                getFromStore = { NSUbiquitousKeyValueStore.default.longLong(forKey: $0) as! T }
            default:
                getFromStore = { NSUbiquitousKeyValueStore.default.object(forKey: $0) as! T }
        }

        let value = getFromStore(key.rawValue)
        return value
    }
}
