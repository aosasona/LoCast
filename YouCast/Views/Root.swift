//
//  Root.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//

import SwiftUI

struct Root: View {
    var body: some View {
        TabView {
            Tab("Home", systemImage: "house") {
                Home()
            }

            Tab("Search", systemImage: "magnifyingglass") {
                Search()
            }

            Tab("Downloads", systemImage: "tray.and.arrow.down") {
                Downloads()
            }
        }
        .tabViewStyle(.sidebarAdaptable)
    }
}

#Preview {
    Root()
}
