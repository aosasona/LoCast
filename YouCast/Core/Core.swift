//
//  Core.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//
import Foundation
import Core

class Core {
    func extractVideoID(from url: URL) throws -> String {
        return try! unwrapCoreError { err in
            CoreExtractVideoID(url.absoluteString, err)
        }
    }
}
