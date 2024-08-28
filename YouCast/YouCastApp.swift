//
//  YouCastApp.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 22/08/2024.
//

import SwiftData
import SwiftUI

@main
struct YouCastApp: App {
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            Entry.self,
            Collection.self
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            Root()
        }
        .modelContainer(sharedModelContainer)
    }
}
