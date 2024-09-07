//
//  Queue.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 28/08/2024.
//
import Foundation

class Queue<T: Equatable>: ObservableObject {
    private let dispatchQueue: DispatchQueue = .global()
    private var items: [T] = []
    private var execute: ((T) -> Void)? = nil
    private var predicate: ((T) -> Bool)?
    private var locked: Bool = false
    
    var isEmpty: Bool { items.isEmpty }
    var count: Int { items.count }

    func enqueue(_ item: T) {
        if items.contains(where: { $0 == item }) { return }
        
        items.append(item)
        
        if !locked { start() }
    }
    
    // Enqueue multiple items while skipping ones that are already in the queue
    func enqueueManyUnique(_ data: [T]) {
        data.forEach(enqueue)
    }
    
    func dequeue() -> T? {
        if items.isEmpty { return nil }
        return items.removeFirst()
    }
    
    func execute(_ execute: @escaping (T) -> Void) {
        self.execute = execute
    }
    
    // Used to decided what queued items to process
    func predicate(_ predicate: @escaping ((T) -> Bool)) {
        self.predicate = predicate
    }
    
    func start() {
        // Ensure we have a execution function
        guard let execute else {
            Logger.shared.warn("Queue is not configured to execute any items")
            return
        }
        
        // Lock the queue to prevent another job from being started
        if locked { return }
        locked = true
        
        dispatchQueue.async {
            while let item = self.dequeue() {
                // Check if we care about the currently queued item
                if let predicate = self.predicate, !predicate(item) { continue }
                
                execute(item)
            }
            
            if self.isEmpty { self.locked = false }
        }
    }
}
