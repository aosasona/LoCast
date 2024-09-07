//
//  LinkPreviewSheet.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 26/08/2024.
//

import SDWebImage
import SDWebImageSwiftUI
import SwiftUI

struct LinkPreviewSheet: View {
    @EnvironmentObject var database: Database
    @EnvironmentObject var entryQueue: Queue<Entry>

    @Environment(\.dismiss) var dismiss
    @ObservedObject var viewModel: ImportViewModel
    @State var showDescription: Bool = false

    let cropValue: CGFloat = 120
    let bgCropValue: CGFloat = 320
    let imagePreviewSize: CGFloat = 240

    var body: some View {
        ZStack {
            GeometryReader { geo in
                ThumbnailImage()
                    .aspectRatio(contentMode: .fill)
                    .frame(minWidth: 0, maxWidth: .infinity)
                    .frame(height: geo.size.height + bgCropValue)
                    .offset(y: -(bgCropValue / 2))
                    .blur(radius: 28)
                    .brightness(-0.3)
            }
            .ignoresSafeArea(.all)

            VStack(alignment: .center, spacing: 6) {
                // FIXME: this is shitty
                GeometryReader { geo in
                    ThumbnailImage()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: geo.size.width, height: geo.size.height + cropValue)
                        .offset(y: -(cropValue / 2))
                }
                .frame(width: imagePreviewSize, height: imagePreviewSize)
                .clipped()
                .cornerRadius(6)
                .shadow(color: .black.opacity(0.7), radius: 20, x: 2, y: 0)
                .padding()

                if let channelId = viewModel.info?.channelId {
                    HStack {
                        Link(destination: URL(string: "https://www.youtube.com/channel/\(channelId)")!) {
                            Text("\(viewModel.info?.author ?? "")")
                                .foregroundStyle(.light)
                        }

                        Image(systemName: "chevron.right")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundStyle(.light)
                    }
                    .padding(.horizontal)
                }

                Text("\(viewModel.info?.title ?? "")")
                    .foregroundStyle(.white.opacity(0.9))
                    .font(.largeTitle.bold())
                    .multilineTextAlignment(.center)
                    .lineLimit(3)
                    .padding(.horizontal)

                if viewModel.info?.isPlaylist == true {
                    Text("Playlist · \(viewModel.info?.itemCount ?? 0) items")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(.white)
                        .padding(.horizontal)
                }

                if let durationMs = viewModel.info?.durationMS {
                    Text(Core.shared.toHumanReadableDuration(durationMS: durationMs))
                        .foregroundStyle(.white)
                        .font(.system(size: 13, weight: .light))
                        .padding(.horizontal)
                }
            }
            .frame(maxHeight: .infinity)
            .safeAreaInset(edge: .bottom) {
                VStack {
                    Button(action: self.addToLibrary) {
                        Label("Add to library", systemImage: "plus.circle")
                            .font(.system(size: 13, weight: .medium))
                            .foregroundStyle(.dark)
                            .padding()
                            .background(.light)
                            .clipShape(RoundedRectangle(cornerRadius: 30))
                    }
                }
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: closeSheet) {
                        Label("Cancel", systemImage: "xmark")
                    }
                    .tint(.light)
                }

                ToolbarItem(placement: .topBarLeading) {
                    Button(action: openDescription) {
                        Label("Description", systemImage: "info.circle")
                    }
                    .tint(.light)
                }
            }
            .sheet(isPresented: $showDescription, onDismiss: { showDescription = false }) {
                NavigationStack {
                    VStack(alignment: .leading) {
                        ScrollView {
                            Text(viewModel.info?.description ?? "No description available.")
                                .font(.body)
                                .padding()
                        }
                    }
                    .navigationTitle("Description")
                    .navigationBarTitleDisplayMode(.inline)
                }
            }
        }
    }

    @ViewBuilder func ThumbnailImage() -> some View {
        WebImage(url: URL(string: viewModel.info?.thumbnail?.sourceURL ?? "")) { image in
            image.resizable()
        } placeholder: {
            Color.black
                .ignoresSafeArea(.all)
                .blur(radius: 18)
        }
    }

    private func addToLibrary() {
        if viewModel.info?.isPlaylist == true {
            viewModel.setError("Playlists are not supported yet")
            return
        }

        guard let entry = viewModel.addVideoToLibrary(db: database) else { return }

        entryQueue.enqueue(entry)
        viewModel.resetImportStates()
    }

    func openDescription() {
        showDescription = true
    }

    func closeSheet() {
        viewModel.resetImportStates()
        dismiss()
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
