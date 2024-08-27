//
//  Settings.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//

import SwiftUI

struct Settings: View {
    @StateObject var viewModel = SettingsViewModel()

    var body: some View {
        Form {
            Section {
                Toggle(isOn: $viewModel.autoPasteFromClipboard) {
                    Label("Auto-Paste From Clipboard", systemImage: "clipboard")
                }
                
                Toggle(isOn: $viewModel.clearClipboardOnPaste) {
                    Label("Clear Clipboard On Paste", systemImage: "trash")
                }
            }
        }
        .navigationTitle("Settings")
        .onChange(of: viewModel.autoPasteFromClipboard) {
            SettingsKVStore.set($1, for: .autoPasteFromClipboard)
        }
    }
}

#Preview {
    Settings()
}
