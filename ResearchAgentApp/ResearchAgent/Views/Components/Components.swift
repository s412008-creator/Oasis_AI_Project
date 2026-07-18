// Components.swift
// Research Agent iOS App
// Reusable UI Components

import SwiftUI

// MARK: - App Background

struct AppBackground: View {
    var body: some View {
        LinearGradient(
            colors: [
                Color(hex: "#0f0f1a"),
                Color(hex: "#1a1a2e"),
                Color(hex: "#16213e"),
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()
    }
}

// MARK: - Glass Card

struct GlassCard<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color.white.opacity(0.07))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(Color.white.opacity(0.12), lineWidth: 1)
                    )
            )
    }
}

// MARK: - Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Gradient Text

struct GradientText: View {
    let text: String
    let font: Font
    let colors: [Color]

    init(_ text: String, font: Font = .title, colors: [Color] = [.purple, .blue]) {
        self.text = text
        self.font = font
        self.colors = colors
    }

    var body: some View {
        Text(text)
            .font(font)
            .foregroundStyle(
                LinearGradient(
                    colors: colors,
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
    }
}

// MARK: - Animated Gradient Button

struct GradientButton: View {
    let title: String
    let icon: String
    let action: () -> Void
    var isDisabled: Bool = false

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .font(.system(size: 17, weight: .semibold))
                Text(title)
                    .font(.system(size: 17, weight: .bold))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                LinearGradient(
                    colors: isDisabled
                        ? [.gray.opacity(0.3), .gray.opacity(0.2)]
                        : [Color(hex: "#667eea"), Color(hex: "#764ba2")],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .foregroundColor(.white)
            .cornerRadius(14)
            .shadow(
                color: isDisabled ? .clear : Color(hex: "#667eea").opacity(0.5),
                radius: 12,
                y: 6
            )
        }
        .disabled(isDisabled)
    }
}

// MARK: - Pulse Animation

struct PulsingCircle: View {
    @State private var animate = false
    let color: Color

    var body: some View {
        ZStack {
            Circle()
                .fill(color.opacity(0.2))
                .frame(width: 20, height: 20)
                .scaleEffect(animate ? 1.5 : 1.0)
                .opacity(animate ? 0 : 1)
            Circle()
                .fill(color)
                .frame(width: 10, height: 10)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: false)) {
                animate = true
            }
        }
    }
}
