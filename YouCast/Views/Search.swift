//
//  Search.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//

import SwiftUI

struct Search: View {
    @State var searchQuery = ""

    var body: some View {
        NavigationStack {
            VStack {
                Text("Searching for \(searchQuery)")
            }
            .navigationTitle("Search")
            .searchable(text: $searchQuery, placement: .navigationBarDrawer(displayMode: .always), prompt: "Title, Collections, Transcripts and More")
        }
    }
}

#Preview {
    Search()
}
