//
//  HomeViewModel.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//
import SwiftUI

class HomeViewModel: ObservableObject {
    @Published var videoURL = ""
    @Published var showImportDialog: Bool = false
    
    var canContinueImport: Bool {
        return !videoURL.isEmpty
    }
}
