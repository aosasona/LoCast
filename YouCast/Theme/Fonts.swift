//
//  Fonts.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 22/08/2024.
//

import Foundation
import SwiftUI
import UIKit

enum JetbrainsMono: String {
    case bold = "JetBrainsMono-Bold"
    case boldItalic = "JetBrainsMono-BoldItalic"
    case extraBold = "JetBrainsMono-ExtraBold"
    case extraBoldItalic = "JetBrainsMono-ExtraBoldItalic"
    case extraLight = "JetBrainsMono-ExtraLight"
    case extraLightitalic = "JetBrainsMono-ExtraLightItalic"
    case italic = "JetBrainsMono-Italic"
    case light = "JetBrainsMono-Light"
    case lightItalic = "JetBrainsMono-LightItalic"
    case medium = "JetBrainsMono-Medium"
    case mediumItalic = "JetBrainsMono-MediumItalic"
    case regular = "JetBrainsMono-Regular"
    case semibold = "JetBrainsMono-SemiBold"
    case semiboldItalic = "JetBrainsMono-SemiBoldItalic"
    case thin = "JetBrainsMono-Thin"
    case thinItalic = "JetBrainsMono-ThinItalic"
}

enum FontSize: CGFloat {
    case body = 14
    case caption = 12
    case heading = 20
    case subtitle = 16
}

enum Fonts {
    case jetbrainsMono(JetbrainsMono)

    func getFontName() -> String {
        switch self {
        case let .jetbrainsMono(font):
            return font.rawValue
        }
    }

    func toFont(_ size: CGFloat) -> Font {
        Font(
            UIFont(name: getFontName(), size: size)
                ?? UIFont.systemFont(ofSize: size)
        )
    }

    func toFont(_ size: FontSize) -> Font {
        toFont(size.rawValue)
    }
}
