//
//  URL+Extension.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//
import Foundation

extension URL {
    func getQueryParam(_ name: String) -> String? {
        guard let url = URLComponents(string: self.absoluteString) else { return nil }
        guard let queryValue = url.queryItems?.first(where: { $0.name == name })?.value else { return nil }
        if queryValue.isEmpty { return nil }
        return queryValue
    }
}
