//
//  ImportVideoAndPlaylist.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//

import SwiftUI

struct ImportVideoAndPlaylist: View {
    @ObservedObject var viewModel: ImportViewModel = .init()

    var body: some View {
        Form {
            Section {
                Label("Enter a video or playlist URL", systemImage: "link")
                TextField("e.g. https://www.youtube.com/watch?v=xxxxxxx", text: viewModel.videoURLString)
                    .keyboardType(.URL)
                    .lineLimit(1)
            }

            Button(action: self.proceedToImportConfirmation) {
                if viewModel.isLoadingMeta {
                    ProgressView()
                } else {
                    Text("Continue")
                }
            }
            .buttonStyle(.fullWidth)
            .listRowInsets(.init(top: 0, leading: 0, bottom: 0, trailing: 0))
            .listRowBackground(Color.clear)
            .disabled(!viewModel.canContinue || viewModel.isLoadingMeta)
        }
        .navigationTitle("Add to library")
        .onChange(of: viewModel.error) { oldValue, newValue in
            // TODO: handle error, maybe use an alert directly
        }
    }

    func proceedToImportConfirmation() {
        DispatchQueue.global().async { viewModel.loadMetadata() }
    }
}

#Preview {
    ImportVideoAndPlaylist()
}
