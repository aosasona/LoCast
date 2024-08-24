//
//  FullWidthButton.swift
//  YouCast
//
//  Created by Ayodeji Osasona on 24/08/2024.
//
import SwiftUI

struct FullWidthButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    let cornerRadius = 11.0

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
//            .font(Fonts.jetbrainsMono(.medium).toFont())
            .foregroundStyle(Color.background)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14.0)
            .padding(.horizontal)
            .background(isEnabled
                ? (
                    !configuration.isPressed ? Color.foreground : Color.foreground.opacity(0.8)
                )
                : Color.foreground.opacity(0.4)
            )
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(isEnabled ? Color.foreground : .clear, lineWidth: 0.5)
                    .brightness(0.15)
            )
            .sensoryFeedback(.impact, trigger: configuration.isPressed)
    }
}

extension ButtonStyle where Self == FullWidthButtonStyle {
    static var fullWidth: Self {
        return .init()
    }
}
