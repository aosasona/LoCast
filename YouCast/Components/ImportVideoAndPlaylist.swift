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
                TextField("Enter a video or playlist URL", text: viewModel.videoURLString)
                    .keyboardType(.URL)
                    .lineLimit(1)
            }

            Button("Continue", action: self.proceedToImportConfirmation)
                .buttonStyle(.fullWidth)
                .listRowInsets(.init(top: 0, leading: 0, bottom: 0, trailing: 0))
                .listRowBackground(Color.clear)
                .disabled(!viewModel.canContinue)
        }
        .navigationTitle("Add to library")
    }
    
    func proceedToImportConfirmation() {
        viewModel.loadMetaData()
    }
}

#Preview {
    ImportVideoAndPlaylist()
}
