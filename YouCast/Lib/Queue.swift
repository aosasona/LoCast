//
//  Queue.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 28/08/2024.
//
import Foundation

class Queue<T>: ObservableObject {
    private let dispatchQueue: DispatchQueue = .global()
    private var items: [T] = []
    private var execute: (T) -> Void = { _ in }
    private var isRunning: Bool = false
    
    var isEmpty: Bool { items.isEmpty }
    var count: Int { items.count }

    func enqueue(_ item: T) {
        items.append(item)
        
        if !isRunning { start() }
    }
    
    func dequeue() -> T? {
        items.removeFirst()
    }
    
    func execute(_ execute: @escaping (T) -> Void) {
        self.execute = execute
    }
    
    func start() {
        if isRunning { return }
        isRunning = true
        
        dispatchQueue.async {
            while let item = self.dequeue() {
                self.execute(item)
            }
            
            if self.isEmpty { self.isRunning = false }
        }
    }
}
