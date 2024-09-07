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
    var database: Database = {
        guard let database = Database.shared else { fatalError() }
        return database
    }()

    var entryQueue: Queue<Entry> {
        let q = Queue<Entry>()

        // TODO: pass in a proper execution function
        q.execute { entry in
            print("Executing: \(entry)")
        }

        return q
    }

    var body: some Scene {
        WindowGroup {
            Root()
                .environmentObject(database)
                .environmentObject(entryQueue)
                .task {
                    let unprocessedEntries = Entry.loadUnprocessedItems(db: database)
                    print(unprocessedEntries)

                    entryQueue.start()
                }
        }
        .modelContainer(database.getModelContainer())
    }
}
