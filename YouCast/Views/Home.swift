//
//  Home.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//

import SwiftUI

struct Home: View {
    @StateObject var viewModel = HomeViewModel()

    var body: some View {
        NavigationStack {
            VStack {
                Text("This is home")
            }
            .navigationTitle("Home")
            .toolbar {
                ToolbarItemGroup(placement: .topBarTrailing) {
                    Menu {
                        Button("Subscribe to a channel", action: {})
                    } label: {
                        Label("Menu", systemImage: "ellipsis.circle")
                    }

                    Button(action: { viewModel.showImportDialog.toggle() }) {
                        Label("Import", systemImage: "plus")
                    }
                }
            }
            .alert("Import", isPresented: $viewModel.showImportDialog) {
                TextField("Enter a video URL", text: $viewModel.videoURL)
                Button("Cancel", role: .cancel) {}
                Button("Continue", action: {}).disabled(!viewModel.canContinueImport)
            } message: {
                Text("Enter a valid video URL to import")
            }
        }
    }
}

#Preview {
    Home()
}
