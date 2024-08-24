//
//  Utils.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//

import Foundation

enum CoreError: Error {
    case raw(String)
}

func unwrapNSErrorPointer(_ rawError: NSErrorPointer?) -> Error? {
    guard let err = rawError else { return nil }
    return err?.pointee
}

// Takes in a function that can produce an NSErrorPointer and converts it into a thrown error instead
func unwrapCoreError<T>(_ body: @escaping ((NSErrorPointer) -> T)) throws -> T {
    let error: NSErrorPointer = nil
    
    let result = body(error)
    if let err = unwrapNSErrorPointer(error) {
        throw CoreError.raw(err.localizedDescription)
    }
    
    return result
}
