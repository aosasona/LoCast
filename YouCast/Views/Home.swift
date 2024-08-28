//
//  Home.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//

import SwiftUI

struct Home: View {
    @StateObject var viewModel = HomeViewModel()
    @StateObject var importViewModel = ImportViewModel()

    var body: some View {
        NavigationStack {
            VStack {
                Text("This is home")
            }
            .navigationTitle("Home")
            .toolbar {
                ToolbarItemGroup(placement: .topBarTrailing) {
                    Menu {
                        Button(action: {}) {
                            Label("Subscribe to feed", systemImage: "dot.radiowaves.left.and.right")
                        }

                        Button(action: { viewModel.showSettingsSheet.toggle() }) {
                            Label("Settings", systemImage: "gearshape")
                        }
                    } label: {
                        Label("Menu", systemImage: "ellipsis.circle")
                    }

                    Button(action: { viewModel.showImportSheet.toggle() }) {
                        Label("Import", systemImage: "plus")
                    }
                }
            }
            .sheet(isPresented: $viewModel.showImportSheet, onDismiss: importViewModel.resetImportStates) {
                NavigationStack {
                    ImportVideoAndPlaylist(viewModel: importViewModel)
                        .fullScreenCover(isPresented: $importViewModel.showPreview, onDismiss: importViewModel.resetImportStates) {
                            NavigationStack {
                                LinkPreviewSheet(viewModel: importViewModel)
                            }
                        }
                }
            }
            .sheet(isPresented: $viewModel.showSettingsSheet) {
                NavigationStack {
                    Settings()
                }
            }
            .onReceive(NotificationCenter.default.publisher(for: UIApplication.didBecomeActiveNotification)) { _ in
                // Only auto-paste if it is enabled and the user isn't already trying to import something
                if SettingsKVStore.get(for: .autoPasteFromClipboard) && !viewModel.showImportSheet {
                    guard let copiedText = UIPasteboard.general.url else { return }

                    // Ensure it is a valid YouTube link
                    if !copiedText.absoluteString.contains("youtube.com") && !copiedText.absoluteString.contains("youtu.be") {
                        Logger.shared.info("Dismissing copied item: Not a valid YouTube link")
                        return
                    }

                    if SettingsKVStore.get(for: .clearClipboardOnPaste) {
                        // Clear the clipboard
                        UIPasteboard.general.urls = []
                    }

                    viewModel.showImportSheet.toggle()
                    importViewModel.setURL(copiedText)
                }
            }
        }
    }
}

#Preview {
    Home()
}
