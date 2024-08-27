//
//  LinkPreviewSheet.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 26/08/2024.
//

import SwiftUI

struct LinkPreviewSheet: View {
    @ObservedObject var viewModel: ImportViewModel

    var body: some View {
        ZStack {
            if let image = viewModel.linkMeta?.resolvedThumbnailImage {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(minWidth: 0, maxWidth: .infinity)
                    .ignoresSafeArea(.all)
                    .blur(radius: 20)
            } else {
                Color(.background)
                    .ignoresSafeArea(.all)
                    .blur(radius: 18)
            }

            VStack(alignment: .center) {
                Text("\(viewModel.linkMeta?.info.title ?? "")")
            }
        }
    }
}

func mockImportViewModel() -> ImportViewModel {
    let importViewModel = ImportViewModel()
    importViewModel.videoURL = URL(string: "https://www.youtube.com/watch?v=2dUMedOr864")!
    importViewModel.loadMetadata()

    let thumbnail = Thumbnail()
    thumbnail.width = 640
    thumbnail.height = 480
    thumbnail.sourceURL = "https://i.ytimg.com/vi/JSz_AyBI_no/sddefault.jpg"

    let meta = VideoMetadata()
    meta.title = "Andy Is A Terrible Liar"
    meta.channelID = "UCUzkafj3xTDZl8lGz3Sf_WA"
    meta.author = "Red Tree Stories"
    meta.views = 2060332
    meta.thumbnails = ThumbnailList()?.addPtr(thumbnail)

    return importViewModel
}

#Preview {
    LinkPreviewSheet(viewModel: mockImportViewModel())
}
