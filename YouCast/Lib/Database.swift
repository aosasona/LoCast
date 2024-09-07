//
//  Database.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 07/09/2024.
//
import Foundation
import SwiftData

final class Database: ObservableObject {
    static let shared: Database? = {
        do {
            return try Database()
        } catch {
            Logger.shared.error("Failed to create database: \(error)")
            return nil
        }
    }()

    private let container: ModelContainer

    private init() throws {
        let schema = Schema([
            Entry.self,
            Collection.self
        ])

        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        self.container = try ModelContainer(for: schema, configurations: [modelConfiguration])
    }

    func getModelContainer() -> ModelContainer {
        self.container
    }

    func insert<T: PersistentModel>(_ item: T) -> Result<Void, Error> {
        do {
            let context = ModelContext(self.container)
            context.insert(item)
            try context.save()
            return .success(())
        } catch {
            return .failure(error)
        }
    }

    func findMany<T: PersistentModel>(predicate: Predicate<T>, sortDescriptors: [SortDescriptor<T>] = []) -> Result<[T], Error> {
        do {
            let context = ModelContext(self.container)
            let fetchDescriptor = FetchDescriptor(predicate: predicate, sortBy: sortDescriptors)
            let result = try context.fetch(fetchDescriptor)
            return .success(result)
        } catch {
            return .failure(error)
        }
    }

    // Swift doesn't allow passing or spreading an array as a variadic function
    func findMany<T: PersistentModel>(predicate: Predicate<T>, sortDescriptors: SortDescriptor<T>...) -> Result<[T], Error> {
        return self.findMany(predicate: predicate, sortDescriptors: sortDescriptors)
    }

    func findOne<T: PersistentModel>(predicate: Predicate<T>, sortDescriptors: [SortDescriptor<T>] = []) -> Result<T?, Error> {
        return self.findMany(predicate: predicate, sortDescriptors: sortDescriptors).map(\.first)
    }

    // Swift doesn't allow passing or spreading an array as a variadic function
    func findOne<T: PersistentModel>(predicate: Predicate<T>, sortDescriptors: SortDescriptor<T>...) -> Result<T?, Error> {
        return self.findOne(predicate: predicate, sortDescriptors: sortDescriptors)
    }

    func exists<T: PersistentModel>(predicate: Predicate<T>) -> Result<Bool, Error> {
        switch self.findOne(predicate: predicate, sortDescriptors: []) {
            case .success(let item): return .success(item != nil)
            case .failure(let err): return .failure(err)
        }
    }
}
